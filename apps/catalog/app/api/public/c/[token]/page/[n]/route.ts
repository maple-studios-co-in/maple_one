import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { pagePath } from "@maple/core/lib/storage";
import { fileResponse } from "@maple/core/lib/filestream";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string; n: string }> }) {
  const { token, n } = await params;
  const c = await prisma.collection.findUnique({ where: { shareToken: token }, select: { id: true, pageCount: true } });
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const num = Math.max(1, Math.min(c.pageCount, parseInt(n, 10) || 1));
  return fileResponse(pagePath(c.id, num), "image/webp", { cache: "public, max-age=86400" });
}
