import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
import { getSession } from "@maple/core/lib/auth";
import { can } from "@maple/core/lib/rbac";
export const dynamic = "force-dynamic";
async function guard() { const u = await getSession(); return !!u && (u.perms.includes("*") || can(u.perms, "manage_roles")); }
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params; const b = await req.json(); const db = await tenantDb();
  if (!(await db.sitePage.findFirst({ where: { id } }))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const data: Record<string, unknown> = {};
  for (const k of ["title", "published", "order"]) if (b[k] !== undefined) data[k] = b[k];
  return NextResponse.json(await db.sitePage.update({ where: { id }, data }));
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params; const db = await tenantDb();
  if (!(await db.sitePage.findFirst({ where: { id } }))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.sitePage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
