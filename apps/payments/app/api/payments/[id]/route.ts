import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
export const dynamic = "force-dynamic";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json();
  if (b.amount !== undefined) b.amount = Number(b.amount);
  if (b.markPaid) { b.status = "paid"; b.paidAt = new Date(); delete b.markPaid; }
  if (b.dueDate !== undefined) b.dueDate = b.dueDate ? new Date(b.dueDate) : null;
  return NextResponse.json(await prisma.payment.update({ where: { id }, data: b }));
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.payment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
