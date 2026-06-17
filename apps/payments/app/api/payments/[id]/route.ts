import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
export const dynamic = "force-dynamic";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await (await tenantDb()).payment.findFirst({ where: { id } }))) return NextResponse.json({ error: "Not found in tenant" }, { status: 404 });
  const b = await req.json();
  if (b.amount !== undefined) b.amount = Number(b.amount);
  if (b.markPaid) { b.status = "paid"; b.paidAt = new Date(); delete b.markPaid; }
  if (b.dueDate !== undefined) b.dueDate = b.dueDate ? new Date(b.dueDate) : null;
  return NextResponse.json(await (await tenantDb()).payment.update({ where: { id }, data: b }));
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await (await tenantDb()).payment.findFirst({ where: { id } }))) return NextResponse.json({ error: "Not found in tenant" }, { status: 404 });
  await (await tenantDb()).payment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
