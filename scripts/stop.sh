#!/usr/bin/env bash
# Stop the local suite (apps + caddy). Postgres container is left running.
pkill -f "next dev" 2>/dev/null && echo "stopped Next apps"
pkill -f "vite" 2>/dev/null && echo "stopped web (vite)"
pkill -f "caddy run" 2>/dev/null && echo "stopped Caddy"
echo "Done. (Postgres 'maple-pg' left running — docker stop maple-pg to halt it.)"
