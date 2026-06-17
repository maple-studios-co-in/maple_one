import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await (await tenantDb()).role.findMany({ orderBy: { isSystem: "desc" } })); }
  catch { return NextResponse.json({ error: "Database not reachable." }, { status: 503 }); }
}
export async function POST(req: Request) {
  const b = await req.json();
  const name = String(b.name || "").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-+|-+$/g, "");
  if (!name) return NextResponse.json({ error: "Name required." }, { status: 400 });
  try {
    const role = await (await tenantDb()).role.create({ data: { name, label: b.label || name, permissions: Array.isArray(b.permissions) ? b.permissions : [] } });
    return NextResponse.json(role);
  } catch { return NextResponse.json({ error: "Role name already exists." }, { status: 400 }); }
}
