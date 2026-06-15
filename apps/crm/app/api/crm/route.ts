import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { leads: true, orders: true, invoices: true, quotations: true } } },
    });
    return NextResponse.json(clients);
  } catch {
    return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 });
  }
}
export async function POST(req: Request) {
  const b = await req.json();
  const client = await prisma.client.create({
    data: {
      name: b.name, company: b.company || null, type: b.type || "b2c", gstin: b.gstin || null,
      phone: b.phone || null, email: b.email || null, address: b.address || null,
      status: b.status || "active", notes: b.notes || null,
    },
  });
  return NextResponse.json(client);
}
