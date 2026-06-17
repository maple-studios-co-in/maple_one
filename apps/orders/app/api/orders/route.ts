import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await (await tenantDb()).order.findMany({
      orderBy: { updatedAt: "desc" },
      include: { client: { select: { name: true } } },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 });
  }
}
export async function POST(req: Request) {
  const b = await req.json();
  const code = b.code || `MO-${Date.now().toString().slice(-6)}`;
  const order = await (await tenantDb()).order.create({
    data: {
      code, title: b.title || "Untitled order", clientId: b.clientId || null, quotationId: b.quotationId || null,
      stage: b.stage || "accepted", value: b.value ? Number(b.value) : 0,
      deliveryDate: b.deliveryDate ? new Date(b.deliveryDate) : null, notes: b.notes || null,
    },
  });
  return NextResponse.json(order);
}
