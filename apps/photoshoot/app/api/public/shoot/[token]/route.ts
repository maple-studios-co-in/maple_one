import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
export const dynamic = "force-dynamic";
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const s = await prisma.shoot.findUnique({ where: { shareToken: token } });
  if (!s) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ title: s.title, product: s.product, colorway: s.colorway, style: s.style, hasVideo: s.hasVideo, published: s.published });
}
