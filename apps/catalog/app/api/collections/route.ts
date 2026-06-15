import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
import { kebab, randomHex } from "@maple/core/lib/slug";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await prisma.collection.findMany({ orderBy: { updatedAt: "desc" } }));
  } catch {
    return NextResponse.json({ error: "Database not reachable. Set DATABASE_URL and run prisma migrate." }, { status: 503 });
  }
}
export async function POST(req: Request) {
  const b = await req.json();
  const toArr = (v: unknown) => Array.isArray(v) ? v : typeof v === "string" && v ? v.split(",").map((x) => x.trim()).filter(Boolean) : [];
  const created = await prisma.collection.create({
    data: {
      title: b.title || "Untitled collection",
      theme: b.theme || null,
      description: b.description || null,
      slug: `${kebab(b.title)}-${randomHex(3)}`,
      shareToken: randomHex(16),
      spaces: toArr(b.spaces),
      categories: toArr(b.categories),
    },
  });
  return NextResponse.json(created);
}
