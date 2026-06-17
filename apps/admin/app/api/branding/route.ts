import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { currentTenant } from "@maple/core/lib/brand";
export const dynamic = "force-dynamic";
export async function GET() {
  const t = await currentTenant();
  if (!t) return NextResponse.json({ error: "No tenant" }, { status: 404 });
  return NextResponse.json({ id: t.id, name: t.name, brandName: t.brandName, logoUrl: t.logoUrl, primaryColor: t.primaryColor, watermarkEnabled: t.watermarkEnabled });
}
export async function PATCH(req: Request) {
  const t = await currentTenant();
  if (!t) return NextResponse.json({ error: "No tenant" }, { status: 404 });
  const b = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of ["brandName", "primaryColor", "watermarkEnabled"]) if (b[k] !== undefined) data[k] = b[k];
  return NextResponse.json(await prisma.tenant.update({ where: { id: t.id }, data }));
}
