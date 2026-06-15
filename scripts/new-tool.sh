#!/usr/bin/env bash
# Usage: scripts/new-tool.sh <name> "<Label>"
set -e
name="$1"; label="${2:-$1}"
[ -z "$name" ] && { echo "usage: new-tool.sh <name> \"<Label>\""; exit 1; }
cd "$(dirname "$0")/.."
src=apps/leads; dst="apps/$name"
[ -d "$dst" ] && { echo "$dst already exists"; exit 1; }
mkdir -p "$dst/app/api/$name/[id]" "$dst/app/api/auth/logout"
sed "s/@maple\/app-leads/@maple\/app-$name/" "$src/package.json" > "$dst/package.json"
cp "$src/next.config.ts" "$src/tsconfig.json" "$src/postcss.config.mjs" "$dst/"
cp "$src/app/globals.css" "$dst/app/"
cp "$src/app/api/auth/logout/route.ts" "$dst/app/api/auth/logout/route.ts"
sed "s/const TOOL = \"leads\"/const TOOL = \"$name\"/" "$src/middleware.ts" > "$dst/middleware.ts"
perl -pe "s/current=\"leads\"/current=\"$name\"/; s/\\QLeads · MapleTools\\E/$label · MapleTools/" "$src/app/layout.tsx" > "$dst/app/layout.tsx"
# stub page + API
cat > "$dst/app/page.tsx" <<TSX
"use client";
import { PageHeader } from "@maple/core/components/PageHeader";
import { Card } from "@maple/core/ui/card";
export default function Page() {
  return (
    <div className="p-6 md:p-8">
      <PageHeader title="$label" description="New tool — start building." />
      <Card className="p-6 text-sm text-muted-foreground">Wire up /api/$name and your UI here.</Card>
    </div>
  );
}
TSX
cat > "$dst/app/api/$name/route.ts" <<TS
import { NextResponse } from "next/server";
import { prisma } from "@maple/core/lib/prisma";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json([]); }
TS
echo "Created $dst. Now add '$name' to Caddyfile, Caddyfile.local, docker-compose.yml, nav.ts, rbac.ts."
