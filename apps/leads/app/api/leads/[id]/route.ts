import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json();
  if (b.value !== undefined) b.value = b.value === null || b.value === "" ? null : Number(b.value);
  const lead = await prisma.lead.update({ where: { id }, data: b });
  return NextResponse.json(lead);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
