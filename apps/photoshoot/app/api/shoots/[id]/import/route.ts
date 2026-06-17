import { NextResponse } from "next/server";
import fs from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { tenantDb } from "@maple/core/lib/tenant-db";
import { shootDir, shootVideoPath, ensureDir } from "@maple/core/lib/storage";
import { makePoster } from "@maple/core/lib/poster";
import { currentTenant } from "@maple/core/lib/brand";
import { watermarkVideo } from "@maple/core/lib/watermark";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await (await tenantDb()).shoot.findUnique({ where: { id } }))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { url } = await req.json();
  if (!/^https?:\/\//i.test(url || "")) return NextResponse.json({ error: "Provide an http(s) video URL." }, { status: 400 });
  try {
    const r = await fetch(url);
    if (!r.ok || !r.body) return NextResponse.json({ error: `Fetch failed (${r.status})` }, { status: 400 });
    ensureDir(shootDir(id));
    await pipeline(Readable.fromWeb(r.body as Parameters<typeof Readable.fromWeb>[0]), fs.createWriteStream(shootVideoPath(id)));
    const _t = await currentTenant();
    if (_t?.watermarkEnabled && _t.logoUrl) await watermarkVideo(shootVideoPath(id), _t.logoUrl);
    await makePoster(id);
    return NextResponse.json(await (await tenantDb()).shoot.update({ where: { id }, data: { hasVideo: true, status: "ready" } }));
  } catch {
    return NextResponse.json({ error: "Could not import that URL." }, { status: 400 });
  }
}
