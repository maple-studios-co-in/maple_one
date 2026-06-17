import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
export const dynamic = "force-dynamic";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json();
  if (b.value !== undefined) b.value = b.value === "" ? 0 : Number(b.value);
  if (b.deliveryDate !== undefined) b.deliveryDate = b.deliveryDate ? new Date(b.deliveryDate) : null;
  return NextResponse.json(await (await tenantDb()).order.update({ where: { id }, data: b }));
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await (await tenantDb()).order.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
