import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await (await tenantDb()).inventoryItem.findMany({ orderBy: { updatedAt: "desc" } }));
  } catch {
    return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 });
  }
}
export async function POST(req: Request) {
  const b = await req.json();
  const item = await (await tenantDb()).inventoryItem.create({
    data: {
      name: b.name, category: b.category || null, sku: b.sku || null, unit: b.unit || "nos",
      quantity: Number(b.quantity || 0), reorderLevel: Number(b.reorderLevel || 0),
      cost: b.cost ? Number(b.cost) : null, location: b.location || null,
    },
  });
  return NextResponse.json(item);
}
