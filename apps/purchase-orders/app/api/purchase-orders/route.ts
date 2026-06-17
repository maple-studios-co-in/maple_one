import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await (await tenantDb()).purchaseOrder.findMany({ orderBy: { updatedAt: "desc" } })); }
  catch { return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 }); }
}
export async function POST(req: Request) {
  const b = await req.json();
  const number = b.number || `PO-${Date.now().toString().slice(-6)}`;
  return NextResponse.json(await (await tenantDb()).purchaseOrder.create({ data: {
    number, vendor: b.vendor || "Vendor", items: b.items || null, total: Number(b.total || 0),
    status: b.status || "draft", expectedDate: b.expectedDate ? new Date(b.expectedDate) : null, notes: b.notes || null,
  } }));
}
