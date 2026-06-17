import "server-only";
import { prisma } from "./prisma";
/** Resolve a role name (within a tenant) to its permission keys. */
export async function permsForRole(roleName: string, tenantId?: string | null): Promise<string[]> {
  try {
    const role = await prisma.role.findFirst({ where: { name: roleName, tenantId: tenantId ?? undefined } });
    return role?.permissions ?? [];
  } catch {
    return [];
  }
}
