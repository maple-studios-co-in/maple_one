import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await (await tenantDb()).lead.findFirst({ where: { id } }))) return NextResponse.json({ error: "Not found in tenant" }, { status: 404 });
  const b = await req.json();
  if (b.value !== undefined) b.value = b.value === null || b.value === "" ? null : Number(b.value);
  const lead = await (await tenantDb()).lead.update({ where: { id }, data: b });
  return NextResponse.json(lead);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await (await tenantDb()).lead.findFirst({ where: { id } }))) return NextResponse.json({ error: "Not found in tenant" }, { status: 404 });
  await (await tenantDb()).lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
