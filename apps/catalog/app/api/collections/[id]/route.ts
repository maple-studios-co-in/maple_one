import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { rmCollection } from "@maple/core/lib/storage";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of ["title", "theme", "description", "published", "spaces", "categories"]) {
    if (b[k] !== undefined) data[k] = b[k];
  }
  return NextResponse.json(await prisma.collection.update({ where: { id }, data }));
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.collection.delete({ where: { id } });
  rmCollection(id);
  return NextResponse.json({ ok: true });
}
