import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
import { hashPassword } from "@maple/core/lib/auth";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return NextResponse.json(await (await tenantDb()).user.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, name: true, email: true, role: true, active: true, createdAt: true } }));
  } catch { return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 }); }
}
export async function POST(req: Request) {
  const b = await req.json();
  if (!b.email || !b.password) return NextResponse.json({ error: "Email and password required." }, { status: 400 });
  try {
    const u = await (await tenantDb()).user.create({ data: {
      name: b.name || b.email, email: String(b.email).toLowerCase().trim(),
      passwordHash: await hashPassword(b.password), role: b.role || "sales",
    } });
    return NextResponse.json({ id: u.id, name: u.name, email: u.email, role: u.role, active: u.active });
  } catch {
    return NextResponse.json({ error: "Could not create (email may already exist)." }, { status: 400 });
  }
}
