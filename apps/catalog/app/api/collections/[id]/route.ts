import { NextResponse } from "next/server";
import { tenantDb } from "@maple/core/lib/tenant-db";
import { rmCollection } from "@maple/core/lib/storage";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await (await tenantDb()).collection.findFirst({ where: { id } }))) return NextResponse.json({ error: "Not found in tenant" }, { status: 404 });
  const b = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of ["title", "theme", "description", "published", "spaces", "categories"]) {
    if (b[k] !== undefined) data[k] = b[k];
  }
  return NextResponse.json(await (await tenantDb()).collection.update({ where: { id }, data }));
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await (await tenantDb()).collection.findFirst({ where: { id } }))) return NextResponse.json({ error: "Not found in tenant" }, { status: 404 });
  await (await tenantDb()).collection.delete({ where: { id } });
  rmCollection(id);
  return NextResponse.json({ ok: true });
}
