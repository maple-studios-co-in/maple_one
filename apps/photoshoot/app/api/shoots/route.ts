import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { randomHex } from "@maple/core/lib/slug";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await prisma.shoot.findMany({ orderBy: { updatedAt: "desc" } }));
  } catch {
    return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 });
  }
}
export async function POST(req: Request) {
  const b = await req.json();
  const created = await prisma.shoot.create({
    data: {
      title: b.title || "Untitled shoot",
      product: b.product || null, colorway: b.colorway || null, style: b.style || null,
      shareToken: randomHex(16),
    },
  });
  return NextResponse.json(created);
}
