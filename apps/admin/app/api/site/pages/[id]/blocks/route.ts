import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
import { getSession } from "@maple/core/lib/auth";
import { can } from "@maple/core/lib/rbac";
export const dynamic = "force-dynamic";
async function guard() { const u = await getSession(); return !!u && (u.perms.includes("*") || can(u.perms, "manage_roles")); }
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params; const db = await tenantDb();
  return NextResponse.json(await db.siteBlock.findMany({ where: { pageId: id }, orderBy: { order: "asc" } }));
}
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await guard())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params; const b = await req.json(); const db = await tenantDb();
  const count = await db.siteBlock.count({ where: { pageId: id } });
  return NextResponse.json(await db.siteBlock.create({ data: { pageId: id, type: b.type || "richtext", label: b.label || "New block", order: count, data: b.data || {} } }));
}
