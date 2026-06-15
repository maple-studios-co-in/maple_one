# Maple Suite (monorepo)

The MapleTools suite split into **one independently-deployable app per tool**, sharing
code through packages and one login across `*.maplefurnishers.com`.

```
packages/
  db/      @maple/db   — Prisma schema + client
  core/    @maple/core — auth/session/sso/rbac, UI kit, theme, SuiteShell, shared lib
apps/
  accounts/   central login (accounts.maplefurnishers.com) + launcher
  leads/ crm/ orders/ challans/ payments/ inventory/ purchase-orders/
  finance/ expenses/ users/        ← built
  quotations/ invoices/ hr/ catalog/ photoshoot/   ← in progress (PDF / media / public routes)
```

## How it works
- Each app is a standalone Next 16 app that imports `@maple/core` (UI + auth + lib) and
  `@maple/db` (Prisma) via `transpilePackages`.
- **SSO**: all apps read the same `mt_session` cookie scoped to `.maplefurnishers.com`
  and verify it with the shared `AUTH_SECRET` — no shared session store. Unauthenticated
  requests redirect to `accounts.maplefurnishers.com/login` (`LOGIN_URL`).
- `SuiteShell` renders the cross-tool sidebar as links to each tool's subdomain.

## Develop
```bash
npm install                      # links workspaces, generates Prisma client
# point @maple/db at your DB (DATABASE_URL) and run migrations from packages/db
npm run -w @maple/app-leads dev  # run a single app
```

## Deploy
Each app builds and deploys independently (`npm run -w @maple/app-<tool> build`). Set the
shared env on every app: `AUTH_SECRET`, `COOKIE_DOMAIN=.maplefurnishers.com`,
`SSO_DOMAIN=.maplefurnishers.com`, `LOGIN_URL=https://accounts.maplefurnishers.com/login`,
`DATABASE_URL`, and (for catalog/photoshoot) `CATALOG_STORAGE`.
