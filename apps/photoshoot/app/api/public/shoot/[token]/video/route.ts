import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { shootVideoPath } from "@maple/core/lib/storage";
import { rangeFileResponse } from "@maple/core/lib/filestream";
export const dynamic = "force-dynamic";
export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const s = await prisma.shoot.findUnique({ where: { shareToken: token }, select: { id: true, hasVideo: true } });
  if (!s || !s.hasVideo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return rangeFileResponse(shootVideoPath(s.id), "video/mp4", req);
}
