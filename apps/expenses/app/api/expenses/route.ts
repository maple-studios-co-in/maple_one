import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await prisma.expense.findMany({ orderBy: { date: "desc" } })); }
  catch { return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 }); }
}
export async function POST(req: Request) {
  const b = await req.json();
  return NextResponse.json(await prisma.expense.create({ data: {
    category: b.category || null, vendor: b.vendor || null, amount: Number(b.amount || 0),
    method: b.method || null, note: b.note || null, date: b.date ? new Date(b.date) : new Date(),
  } }));
}
