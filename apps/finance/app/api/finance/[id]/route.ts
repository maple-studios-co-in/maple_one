import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.financeEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
