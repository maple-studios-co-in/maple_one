import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { pdfPath } from "@maple/core/lib/storage";
import { fileResponse } from "@maple/core/lib/filestream";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = await prisma.collection.findUnique({ where: { shareToken: token }, select: { id: true, title: true, hasPdf: true } });
  if (!c || !c.hasPdf) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const safe = (c.title || "collection").replace(/[^a-z0-9]+/gi, "-");
  return fileResponse(pdfPath(c.id), "application/pdf", { download: `${safe}.pdf`, cache: "private, max-age=0" });
}
