# Contributing to Maple

## Repo layout
- `apps/web` — marketing site (Vite) → `maplefurnishers.com`
- `apps/admin` — login + launcher → `admin.maplefurnishers.com`
- `apps/<tool>` — the tools → `<tool>.maplefurnishers.com`
- `packages/core` — auth, UI kit, shared libs (`@maple/core`)
- `packages/db` — Prisma schema + client (`@maple/db`)

## Run locally
```bash
npm install
# DB once (Postgres on :5544):
DATABASE_URL=postgresql://postgres:maple@localhost:5544/mapletools npm run -w @maple/db push
DATABASE_URL=postgresql://postgres:maple@localhost:5544/mapletools npm run -w @maple/db seed
# start everything + the proxy (real subdomains, see hosts.local.txt):
bash scripts/dev-all.sh
sudo caddy run --config Caddyfile.local
```
Open https://admin.maplefurnishers.com (login) and https://maplefurnishers.com (marketing).
Per-app env is read from each app's `.env.local`.

## Branches
- `main` → production (auto-deploys to prod)
- `develop` → staging (auto-deploys to stage)
- `feature/<thing>` → branch off `develop`, open a PR into `develop`

Every PR runs lint + build (CI). Tag prod releases `vX.Y.Z`.

## Add a new tool
```bash
bash scripts/new-tool.sh <name> "<Label>"
```
Then add `<name>` to: `Caddyfile`, `Caddyfile.local`, `docker-compose.yml`,
`packages/core/src/lib/nav.ts` (TOOLS) and `packages/core/src/lib/rbac.ts` (TOOL_ACCESS).

## Shared code
Changes in `packages/core` / `packages/db` affect every app — review carefully.
