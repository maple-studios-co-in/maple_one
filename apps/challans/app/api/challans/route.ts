import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await (await tenantDb()).deliveryChallan.findMany({ orderBy: { updatedAt: "desc" }, include: { client: { select: { name: true } } } })); }
  catch { return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 }); }
}
export async function POST(req: Request) {
  const b = await req.json();
  const number = b.number || `DC-${Date.now().toString().slice(-6)}`;
  return NextResponse.json(await (await tenantDb()).deliveryChallan.create({ data: {
    number, items: b.items || null, vehicleNo: b.vehicleNo || null, driver: b.driver || null,
    status: b.status || "prepared", notes: b.notes || null,
  } }));
}
