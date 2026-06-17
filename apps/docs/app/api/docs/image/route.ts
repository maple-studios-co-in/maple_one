import { NextResponse } from "next/server";
import { getSession } from "@maple/core/lib/auth";
import { can } from "@maple/core/lib/rbac";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const user = await getSession();
  if (!user || !(user.perms.includes("*") || can(user.perms, "manage_roles"))) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  const type = req.headers.get("content-type") || "image/png";
  const buf = Buffer.from(await req.arrayBuffer());
  if (buf.length > 3_000_000) return NextResponse.json({ error: "Image too large (max 3MB)." }, { status: 400 });
  return NextResponse.json({ url: `data:${type};base64,${buf.toString("base64")}` });
}
