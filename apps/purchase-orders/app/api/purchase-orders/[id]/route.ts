import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
export const dynamic = "force-dynamic";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const b = await req.json();
  if (b.total !== undefined) b.total = Number(b.total);
  if (b.expectedDate !== undefined) b.expectedDate = b.expectedDate ? new Date(b.expectedDate) : null;
  return NextResponse.json(await prisma.purchaseOrder.update({ where: { id }, data: b }));
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; await prisma.purchaseOrder.delete({ where: { id } }); return NextResponse.json({ ok: true });
}
