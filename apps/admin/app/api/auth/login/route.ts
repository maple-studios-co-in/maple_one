import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { verifyPassword } from "@maple/core/lib/auth";
import { signSession, COOKIE, sessionCookieOptions, SESSION_MAX_AGE } from "@maple/core/lib/session";
import { permsForRole } from "@maple/core/lib/permissions";
import { currentTenant } from "@maple/core/lib/brand";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  try {
    const tenant = await currentTenant();
    const email = (body.email || "").toLowerCase().trim();
    const user = await prisma.user.findFirst({ where: { email, ...(tenant ? { tenantId: tenant.id } : {}) } });
    if (!user || !user.active || !(await verifyPassword(body.password || "", user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const perms = await permsForRole(user.role, user.tenantId);
    const token = await signSession({ id: user.id, name: user.name, email: user.email, role: user.role, perms, tenantId: user.tenantId });
    const res = NextResponse.json({ ok: true, role: user.role });
    res.cookies.set(COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE));
    return res;
  } catch {
    return NextResponse.json({ error: "Database not reachable. Run prisma migrate + seed." }, { status: 503 });
  }
}
