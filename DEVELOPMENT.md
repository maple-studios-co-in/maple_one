# MapleOne — Developer guide

A monorepo (npm workspaces + Turborepo): one Next.js app per tool, two shared packages,
a Vite marketing site, behind Caddy with one shared login across `*.maplefurnishers.com`.

## Run it locally — one command
```bash
bash scripts/dev.sh        # or: npm run dev:local
```
Brings up Postgres, installs deps, migrates + seeds, sets `/etc/hosts`, starts the marketing
site + admin + every tool, then Caddy (HTTPS). Open **https://admin.maplefurnishers.com**
(`admin@maplefurnishers.com` / `maple@123`). Stop with `bash scripts/stop.sh`.

> Full, illustrated dev docs are **hosted** at `docs.maplefurnishers.com → For developers`
> (Architecture, Local development, Adding a tool, Auth/roles, Feature flags, Multi-tenancy &
> branding, Deploy). The source is `apps/docs/app/content.ts`.

## Layout
```
packages/db     @maple/db    Prisma schema + client
packages/core   @maple/core  auth/session/sso/rbac, UI kit, theme, brand, flags, tenant-db
apps/web        marketing (Vite)          maplefurnishers.com
apps/admin      login + launcher          admin.maplefurnishers.com
apps/docs       this docs site            docs.maplefurnishers.com
apps/<tool>     one app per tool          <tool>.maplefurnishers.com
```

## Everyday commands
```bash
npm run build                              # turbo build all apps
npm run -w @maple/app-<tool> dev -- -p N   # one app
npm run -w @maple/db push                  # apply schema changes
npm run -w @maple/db seed                  # tenant + roles + users + backfill
npm run shots                              # capture docs screenshots (Playwright)
bash scripts/new-tool.sh <name> "<Label>"  # scaffold a new tool
```

## Key conventions
- **Data:** use `tenantDb()` (not `prisma`) in API routes — reads are tenant-filtered, creates
  are tenant-stamped. New models get a `tenantId String?`.
- **Auth:** `mt_session` JWT carries `perms[]` + `tid`; gate with `canAccessTool`/`can`
  (`@maple/core/lib/rbac`). Manage roles in the *Team & access* tool.
- **Flags:** `isEnabled("tool.<name>")` / `<tool>.<feature>` via Flipt; fail-open.
- **Branding:** `getBrand()` per host; logo flows to the shell + PDFs.
- **Branches:** `feature/*` → PR into `develop` (auto stage) → `main` (auto prod). CI runs lint+build on every PR.

## Reference docs
- `AWS-RUNBOOK-PHASE2.md` — go live on AWS, step by step
- `FLAGS.md` — feature-flag keys & per-env usage
- `CONTRIBUTING.md` — branch/PR/add-a-tool
- `MAPLE-ECOSYSTEM-PLAN.md` — overall architecture & roadmap
