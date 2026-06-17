import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
export const dynamic = "force-dynamic";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json();
  ["quantity", "reorderLevel", "cost"].forEach((k) => { if (b[k] !== undefined && b[k] !== null && b[k] !== "") b[k] = Number(b[k]); });
  return NextResponse.json(await (await tenantDb()).inventoryItem.update({ where: { id }, data: b }));
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await (await tenantDb()).inventoryItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
