import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
import { hashPassword } from "@maple/core/lib/auth";
export const dynamic = "force-dynamic";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await (await tenantDb()).user.findFirst({ where: { id } }))) return NextResponse.json({ error: "Not found in tenant" }, { status: 404 }); const b = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of ["name", "role", "active"]) if (b[k] !== undefined) data[k] = b[k];
  if (b.password) data.passwordHash = await hashPassword(b.password);
  const u = await (await tenantDb()).user.update({ where: { id }, data });
  return NextResponse.json({ id: u.id, name: u.name, email: u.email, role: u.role, active: u.active });
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await (await tenantDb()).user.findFirst({ where: { id } }))) return NextResponse.json({ error: "Not found in tenant" }, { status: 404 });
  const target = await (await tenantDb()).user.findUnique({ where: { id } });
  if (target?.role === "admin") {
    const admins = await (await tenantDb()).user.count({ where: { role: "admin" } });
    if (admins <= 1) return NextResponse.json({ error: "Can't delete the last admin." }, { status: 400 });
  }
  await (await tenantDb()).user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
