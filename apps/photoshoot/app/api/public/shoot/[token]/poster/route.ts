import { NextResponse } from "next/server";
import fs from "node:fs";
import { prisma } from "@maple/core/lib/prisma";
import { shootPosterPath, shootSourcePath } from "@maple/core/lib/storage";
import { fileResponse } from "@maple/core/lib/filestream";
export const dynamic = "force-dynamic";
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const s = await prisma.shoot.findUnique({ where: { shareToken: token }, select: { id: true } });
  if (!s) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (fs.existsSync(shootPosterPath(s.id))) return fileResponse(shootPosterPath(s.id), "image/jpeg", { cache: "public, max-age=86400" });
  if (fs.existsSync(shootSourcePath(s.id))) return fileResponse(shootSourcePath(s.id), "image/webp", { cache: "public, max-age=86400" });
  return NextResponse.json({ error: "No poster" }, { status: 404 });
}
