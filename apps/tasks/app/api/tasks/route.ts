import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return NextResponse.json(await prisma.task.findMany({ orderBy: { updatedAt: "desc" }, include: { assignee: { select: { name: true } } } }));
  } catch { return NextResponse.json({ error: "Database not reachable." }, { status: 503 }); }
}
export async function POST(req: Request) {
  const b = await req.json();
  if (!b.title?.trim()) return NextResponse.json({ error: "Title required." }, { status: 400 });
  return NextResponse.json(await prisma.task.create({ data: {
    title: b.title, description: b.description || null, status: b.status || "todo",
    priority: b.priority || "medium", assigneeId: b.assigneeId || null,
    dueDate: b.dueDate ? new Date(b.dueDate) : null,
  } }));
}
