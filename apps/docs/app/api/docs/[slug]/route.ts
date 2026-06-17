import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { tenantDb } from "@maple/core/lib/tenant-db";
import { getTenantId } from "@maple/core/lib/tenant";
import { getSession } from "@maple/core/lib/auth";
import { can } from "@maple/core/lib/rbac";
export const dynamic = "force-dynamic";
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try { return NextResponse.json(await (await tenantDb()).doc.findFirst({ where: { slug } })); }
  catch { return NextResponse.json(null); }
}
export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getSession();
  if (!user || !(user.perms.includes("*") || can(user.perms, "manage_roles"))) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  const { slug } = await params; const b = await req.json();
  const tenantId = (await getTenantId()) ?? "";
  const doc = await prisma.doc.upsert({
    where: { tenantId_slug: { tenantId, slug } },
    update: { title: b.title, tagline: b.tagline || null, body: b.body || "" },
    create: { slug, title: b.title || slug, tagline: b.tagline || null, body: b.body || "", tenantId },
  });
  return NextResponse.json(doc);
}
