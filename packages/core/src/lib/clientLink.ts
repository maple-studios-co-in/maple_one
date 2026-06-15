import "server-only";
import { prisma } from "./prisma";

/** Match an existing client by name (case-insensitive) or create one. Backfills
 *  missing phone/address/gstin. Returns the client id (or null if no name). */
export async function findOrCreateClient(c: { name?: string; phone?: string; address?: string; gstin?: string }): Promise<string | null> {
  const name = (c.name || "").trim();
  if (!name) return null;
  const existing = await prisma.client.findFirst({ where: { name: { equals: name, mode: "insensitive" } } });
  if (existing) {
    const data: Record<string, string> = {};
    if (!existing.phone && c.phone) data.phone = c.phone;
    if (!existing.address && c.address) data.address = c.address;
    if (!existing.gstin && c.gstin) data.gstin = c.gstin;
    if (Object.keys(data).length) await prisma.client.update({ where: { id: existing.id }, data });
    return existing.id;
  }
  const created = await prisma.client.create({ data: { name, phone: c.phone || null, address: c.address || null, gstin: c.gstin || null } });
  return created.id;
}
