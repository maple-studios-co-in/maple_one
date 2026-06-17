import { NextResponse } from "next/server";
import sharp from "sharp";
import { tenantDb } from "@maple/core/lib/tenant-db";
import { shootDir, shootSourcePath, ensureDir } from "@maple/core/lib/storage";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await (await tenantDb()).shoot.findFirst({ where: { id } }))) return NextResponse.json({ error: "Not found in tenant" }, { status: 404 });
  if (!(await (await tenantDb()).shoot.findUnique({ where: { id } }))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!req.body) return NextResponse.json({ error: "No file" }, { status: 400 });
  ensureDir(shootDir(id));
  const buf = Buffer.from(await req.arrayBuffer());
  await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(shootSourcePath(id));
  return NextResponse.json(await (await tenantDb()).shoot.update({ where: { id }, data: { hasSource: true } }));
}
