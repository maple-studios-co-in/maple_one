import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
import { findOrCreateClient } from "@maple/core/lib/clientLink";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await (await tenantDb()).invoice.findMany({ orderBy: { createdAt: "desc" }, include: { client: { select: { name: true } } } }));
  } catch {
    return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 });
  }
}
export async function POST(req: Request) {
  const b = await req.json();
  if (!b.number) return NextResponse.json({ error: "Invoice number required." }, { status: 400 });
  try {
    const clientId = await findOrCreateClient(b.client || {});
    const due = b.dueDate ? new Date(b.dueDate) : null;
    const inv = await (await tenantDb()).invoice.upsert({
      where: { number: b.number },
      create: { number: b.number, total: Number(b.total || 0), status: b.status || "unpaid", dueDate: due, data: b.data, clientId },
      update: { total: Number(b.total || 0), status: b.status || "unpaid", dueDate: due, data: b.data, clientId },
    });
    // ensure a payment row exists for this invoice (so it appears in Payments)
    const hasPay = await (await tenantDb()).payment.findFirst({ where: { invoiceId: inv.id } });
    if (!hasPay && inv.total > 0) {
      await (await tenantDb()).payment.create({ data: { invoiceId: inv.id, clientId, label: `Invoice ${inv.number}`, amount: inv.total, dueDate: due, status: "due" } });
    }
    return NextResponse.json(inv);
  } catch {
    return NextResponse.json({ error: "Could not save." }, { status: 503 });
  }
}
