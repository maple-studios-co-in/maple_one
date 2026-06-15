import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { updatedAt: "desc" } });
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const b = await req.json();
  const lead = await prisma.lead.create({
    data: {
      name: b.name,
      phone: b.phone || null,
      email: b.email || null,
      source: b.source || null,
      status: b.status || "new",
      note: b.note || null,
      value: b.value ? Number(b.value) : null,
    },
  });
  return NextResponse.json(lead);
}
