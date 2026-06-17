import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const entries = await (await tenantDb()).financeEntry.findMany({ orderBy: { date: "desc" } });
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const b = await req.json();
  const entry = await (await tenantDb()).financeEntry.create({
    data: {
      type: b.type === "income" ? "income" : "expense",
      category: b.category || null,
      amount: Number(b.amount) || 0,
      note: b.note || null,
      date: b.date ? new Date(b.date) : new Date(),
    },
  });
  return NextResponse.json(entry);
}
