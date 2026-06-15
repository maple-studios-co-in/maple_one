import { NextResponse } from "next/server";
import fs from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { prisma } from "@maple/core/lib/prisma";
import { collectionDir, pdfPath, pagesDir, ensureDir } from "@maple/core/lib/storage";
import { renderCollectionPdf } from "@maple/core/lib/pdf-render";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exists = await prisma.collection.findUnique({ where: { id } });
  if (!exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!req.body) return NextResponse.json({ error: "No file" }, { status: 400 });

  ensureDir(collectionDir(id));
  // fresh pages dir
  fs.rmSync(pagesDir(id), { recursive: true, force: true });
  // stream raw body -> disk (no full-file buffering)
  await pipeline(Readable.fromWeb(req.body as Parameters<typeof Readable.fromWeb>[0]), fs.createWriteStream(pdfPath(id)));

  try {
    const count = await renderCollectionPdf(id, pdfPath(id));
    const updated = await prisma.collection.update({ where: { id }, data: { hasPdf: true, pageCount: count } });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("pdf render failed", e);
    return NextResponse.json({ error: "Could not process that PDF." }, { status: 500 });
  }
}
