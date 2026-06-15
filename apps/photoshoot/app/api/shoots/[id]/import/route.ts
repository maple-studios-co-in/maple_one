import { NextResponse } from "next/server";
import fs from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { prisma } from "@maple/core/lib/prisma";
import { shootDir, shootVideoPath, ensureDir } from "@maple/core/lib/storage";
import { makePoster } from "@maple/core/lib/poster";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await prisma.shoot.findUnique({ where: { id } }))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { url } = await req.json();
  if (!/^https?:\/\//i.test(url || "")) return NextResponse.json({ error: "Provide an http(s) video URL." }, { status: 400 });
  try {
    const r = await fetch(url);
    if (!r.ok || !r.body) return NextResponse.json({ error: `Fetch failed (${r.status})` }, { status: 400 });
    ensureDir(shootDir(id));
    await pipeline(Readable.fromWeb(r.body as Parameters<typeof Readable.fromWeb>[0]), fs.createWriteStream(shootVideoPath(id)));
    await makePoster(id);
    return NextResponse.json(await prisma.shoot.update({ where: { id }, data: { hasVideo: true, status: "ready" } }));
  } catch {
    return NextResponse.json({ error: "Could not import that URL." }, { status: 400 });
  }
}
