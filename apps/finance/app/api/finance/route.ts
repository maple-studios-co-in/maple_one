import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const entries = await prisma.financeEntry.findMany({ orderBy: { date: "desc" } });
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const b = await req.json();
  const entry = await prisma.financeEntry.create({
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
