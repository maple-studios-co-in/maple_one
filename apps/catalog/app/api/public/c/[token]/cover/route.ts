import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { coverPath } from "@maple/core/lib/storage";
import { fileResponse } from "@maple/core/lib/filestream";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = await prisma.collection.findUnique({ where: { shareToken: token }, select: { id: true } });
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return fileResponse(coverPath(c.id), "image/webp", { cache: "public, max-age=86400" });
}
