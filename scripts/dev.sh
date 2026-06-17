#!/usr/bin/env bash
# One command to run the whole MapleOne suite locally:
#   bash scripts/dev.sh
# Brings up Postgres, installs deps, migrates+seeds, /etc/hosts, all apps, and Caddy.
# Stop with Ctrl+C (Caddy) then `bash scripts/stop.sh`, or just Ctrl+C twice.
set -e
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
DB="postgresql://postgres:maple@localhost:5544/mapletools?schema=public"
TOOLS=(admin leads crm quotations orders challans invoices payments catalog photoshoot inventory purchase-orders finance expenses hr users tasks docs)

say() { printf "\n\033[1;35m▸ %s\033[0m\n" "$1"; }

say "Postgres (:5544)"
if command -v docker >/dev/null && ! docker ps --format '{{.Names}}' | grep -qx maple-pg; then
  if docker ps -a --format '{{.Names}}' | grep -qx maple-pg; then docker start maple-pg >/dev/null
  else docker run --name maple-pg -e POSTGRES_PASSWORD=maple -e POSTGRES_DB=mapletools -p 5544:5432 -d postgres:16 >/dev/null; fi
  sleep 4
fi

say "Dependencies"
npm install

say "Database (push + seed)"
DATABASE_URL="$DB" npm run -w @maple/db push --silent
DATABASE_URL="$DB" npm run -w @maple/db seed --silent

say "Hosts file"
HOSTS=(maplefurnishers.com www.maplefurnishers.com flags.maplefurnishers.com)
for t in "${TOOLS[@]}"; do HOSTS+=("$t.maplefurnishers.com"); done
MISS=()
for h in "${HOSTS[@]}"; do grep -qw "$h" /etc/hosts || MISS+=("$h"); done
if [ ${#MISS[@]} -gt 0 ]; then
  echo "  adding ${#MISS[@]} entries to /etc/hosts (sudo)…"
  echo "127.0.0.1 ${MISS[*]}" | sudo tee -a /etc/hosts >/dev/null
  sudo dscacheutil -flushcache 2>/dev/null || true
  sudo killall -HUP mDNSResponder 2>/dev/null || true
fi

say "Starting apps (logs in .devlogs/)"
mkdir -p .devlogs
npm run -w @maple/app-web dev -- --port 5173 --host 127.0.0.1 > .devlogs/web.log 2>&1 &
port=3001
for app in "${TOOLS[@]}"; do
  npm run -w "@maple/app-$app" dev -- -p "$port" > ".devlogs/$app.log" 2>&1 &
  echo "  $app → :$port"; port=$((port+1))
done
echo "  web → :5173"
echo "  waiting ~12s for them to compile…"; sleep 12

say "Caddy (HTTPS proxy on :443 — needs sudo)"
echo "  Open:  https://admin.maplefurnishers.com   (admin@maplefurnishers.com / maple@123)"
echo "         https://maplefurnishers.com (marketing) · https://docs.maplefurnishers.com (docs)"
trap 'echo; echo "Stopping apps…"; pkill -f "next dev" 2>/dev/null; pkill -f "vite" 2>/dev/null; exit 0' INT TERM
sudo caddy run --config Caddyfile.local
