import { NextResponse } from "next/server";
import sharp from "sharp";
import { prisma } from "@maple/core/lib/prisma";
import { shootDir, shootSourcePath, ensureDir } from "@maple/core/lib/storage";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await prisma.shoot.findUnique({ where: { id } }))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!req.body) return NextResponse.json({ error: "No file" }, { status: 400 });
  ensureDir(shootDir(id));
  const buf = Buffer.from(await req.arrayBuffer());
  await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(shootSourcePath(id));
  return NextResponse.json(await prisma.shoot.update({ where: { id }, data: { hasSource: true } }));
}
