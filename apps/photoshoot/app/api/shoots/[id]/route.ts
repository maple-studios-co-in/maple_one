import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { rmShoot } from "@maple/core/lib/storage";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of ["title", "product", "colorway", "style", "published", "status"]) if (b[k] !== undefined) data[k] = b[k];
  return NextResponse.json(await prisma.shoot.update({ where: { id }, data }));
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.shoot.delete({ where: { id } });
  rmShoot(id);
  return NextResponse.json({ ok: true });
}
