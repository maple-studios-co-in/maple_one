import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await prisma.role.findMany({ orderBy: { isSystem: "desc" } })); }
  catch { return NextResponse.json({ error: "Database not reachable." }, { status: 503 }); }
}
export async function POST(req: Request) {
  const b = await req.json();
  const name = String(b.name || "").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "");
  if (!name) return NextResponse.json({ error: "Name required." }, { status: 400 });
  try {
    const role = await prisma.role.create({ data: { name, label: b.label || name, permissions: Array.isArray(b.permissions) ? b.permissions : [] } });
    return NextResponse.json(role);
  } catch { return NextResponse.json({ error: "Role name already exists." }, { status: 400 }); }
}
