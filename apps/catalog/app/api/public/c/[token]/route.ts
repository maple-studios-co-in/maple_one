import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const c = await prisma.collection.findUnique({ where: { shareToken: token } });
    if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      title: c.title, theme: c.theme, description: c.description,
      spaces: c.spaces, categories: c.categories,
      pageCount: c.pageCount, hasPdf: c.hasPdf, published: c.published,
    });
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
}
