import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
import { getSession } from "@maple/core/lib/auth";
import { can } from "@maple/core/lib/rbac";
export const dynamic = "force-dynamic";
async function guard() { const u = await getSession(); return !!u && (u.perms.includes("*") || can(u.perms, "manage_roles")); }
export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const db = await tenantDb();
  return NextResponse.json(await db.sitePage.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { blocks: true } } } }));
}
export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const b = await req.json();
  const slug = String(b.slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const db = await tenantDb();
  const count = await db.sitePage.count();
  try { return NextResponse.json(await db.sitePage.create({ data: { slug, title: b.title || slug, order: count } })); }
  catch { return NextResponse.json({ error: "slug already exists" }, { status: 400 }); }
}
