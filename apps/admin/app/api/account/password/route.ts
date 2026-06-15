import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { getSession } from "@maple/core/lib/auth";
import { hashPassword, verifyPassword } from "@maple/core/lib/auth";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const me = await getSession();
  if (!me) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { current, next } = await req.json();
  if (!next || String(next).length < 6) return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { id: me.id } });
  if (!user || !(await verifyPassword(current || "", user.passwordHash))) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  await prisma.user.update({ where: { id: me.id }, data: { passwordHash: await hashPassword(next) } });
  return NextResponse.json({ ok: true });
}
