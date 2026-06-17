import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { currentTenant } from "@maple/core/lib/brand";
export const dynamic = "force-dynamic";

const cors = { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=30" };
export function OPTIONS() { return new NextResponse(null, { headers: { ...cors, "Access-Control-Allow-Methods": "GET" } }); }

export async function GET() {
  try {
    const t = await currentTenant();
    const pages = t ? await prisma.sitePage.findMany({
      where: { tenantId: t.id, published: true },
      orderBy: { order: "asc" },
      include: { blocks: { where: { enabled: true }, orderBy: { order: "asc" }, select: { type: true, label: true, data: true, order: true } } },
    }) : [];
    return NextResponse.json({ brand: t ? { name: t.brandName, logoUrl: t.logoUrl, primaryColor: t.primaryColor } : { name: "MapleOne" }, pages }, { headers: cors });
  } catch {
    return NextResponse.json({ brand: { name: "MapleOne" }, pages: [] }, { headers: cors });
  }
}
