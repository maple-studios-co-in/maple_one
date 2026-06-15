#!/usr/bin/env bash
# Start the marketing site (vite) + admin + all tools locally. Then: sudo caddy run --config Caddyfile.local
cd "$(dirname "$0")/.."
mkdir -p .devlogs
echo "starting web (marketing) on :5173"
npm run -w @maple/app-web dev -- --port 5173 > .devlogs/web.log 2>&1 &
apps=(admin leads crm quotations orders challans invoices payments catalog photoshoot inventory purchase-orders finance expenses hr users)
port=3001
for app in "${apps[@]}"; do
  echo "starting $app on :$port"
  npm run -w "@maple/app-$app" dev -- -p "$port" > ".devlogs/$app.log" 2>&1 &
  port=$((port+1))
done
echo "All starting (logs in .devlogs/). After ~20s:  sudo caddy run --config Caddyfile.local"
echo "Stop:  pkill -f 'next dev'; pkill -f vite"
wait
