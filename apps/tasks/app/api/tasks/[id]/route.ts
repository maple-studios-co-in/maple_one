import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
export const dynamic = "force-dynamic";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const b = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of ["title", "description", "status", "priority", "assigneeId"]) if (b[k] !== undefined) data[k] = b[k] || null;
  if (b.dueDate !== undefined) data.dueDate = b.dueDate ? new Date(b.dueDate) : null;
  return NextResponse.json(await (await tenantDb()).task.update({ where: { id }, data }));
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; await (await tenantDb()).task.delete({ where: { id } }); return NextResponse.json({ ok: true });
}
