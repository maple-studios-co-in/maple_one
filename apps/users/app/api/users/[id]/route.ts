import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { hashPassword } from "@maple/core/lib/auth";
export const dynamic = "force-dynamic";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const b = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of ["name", "role", "active"]) if (b[k] !== undefined) data[k] = b[k];
  if (b.password) data.passwordHash = await hashPassword(b.password);
  const u = await prisma.user.update({ where: { id }, data });
  return NextResponse.json({ id: u.id, name: u.name, email: u.email, role: u.role, active: u.active });
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (target?.role === "admin") {
    const admins = await prisma.user.count({ where: { role: "admin" } });
    if (admins <= 1) return NextResponse.json({ error: "Can't delete the last admin." }, { status: 400 });
  }
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
