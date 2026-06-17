import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
export const dynamic = "force-dynamic";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const b = await req.json();
  const data: Record<string, unknown> = {};
  if (b.label !== undefined) data.label = b.label;
  if (Array.isArray(b.permissions)) data.permissions = b.permissions;
  return NextResponse.json(await (await tenantDb()).role.update({ where: { id }, data }));
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const role = await (await tenantDb()).role.findUnique({ where: { id } });
  if (role?.isSystem) return NextResponse.json({ error: "Can't delete a system role." }, { status: 400 });
  await (await tenantDb()).role.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
