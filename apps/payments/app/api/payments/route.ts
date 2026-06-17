import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payments = await (await tenantDb()).payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: { select: { name: true } }, invoice: { select: { number: true } } },
    });
    return NextResponse.json(payments);
  } catch {
    return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 });
  }
}
export async function POST(req: Request) {
  const b = await req.json();
  const payment = await (await tenantDb()).payment.create({
    data: {
      clientId: b.clientId || null, invoiceId: b.invoiceId || null, label: b.label || null,
      amount: Number(b.amount || 0), method: b.method || null,
      dueDate: b.dueDate ? new Date(b.dueDate) : null, status: b.status || "due", note: b.note || null,
    },
  });
  return NextResponse.json(payment);
}
