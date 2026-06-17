import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { currentTenant } from "@maple/core/lib/brand";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const t = await currentTenant();
  if (!t) return NextResponse.json({ error: "No tenant" }, { status: 404 });
  const type = req.headers.get("content-type") || "image/png";
  const buf = Buffer.from(await req.arrayBuffer());
  if (buf.length > 1_500_000) return NextResponse.json({ error: "Logo too large (max 1.5MB)." }, { status: 400 });
  const logoUrl = `data:${type};base64,${buf.toString("base64")}`;
  await prisma.tenant.update({ where: { id: t.id }, data: { logoUrl } });
  return NextResponse.json({ ok: true });
}
