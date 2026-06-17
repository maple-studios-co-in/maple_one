import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
export const dynamic = "force-dynamic";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await (await tenantDb()).purchaseOrder.findFirst({ where: { id } }))) return NextResponse.json({ error: "Not found in tenant" }, { status: 404 }); const b = await req.json();
  if (b.total !== undefined) b.total = Number(b.total);
  if (b.expectedDate !== undefined) b.expectedDate = b.expectedDate ? new Date(b.expectedDate) : null;
  return NextResponse.json(await (await tenantDb()).purchaseOrder.update({ where: { id }, data: b }));
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await (await tenantDb()).purchaseOrder.findFirst({ where: { id } }))) return NextResponse.json({ error: "Not found in tenant" }, { status: 404 }); await (await tenantDb()).purchaseOrder.delete({ where: { id } }); return NextResponse.json({ ok: true });
}
