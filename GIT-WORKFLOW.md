# Git workflow — MapleOne

Three long-lived branches, each wired to its own environment. Code always flows
**up**: feature → develop → staging → main. Never commit straight to staging or main.

| Branch | Environment | Deploys via | Who merges |
|---|---|---|---|
| `develop` | **dev** (integration) | `.github/workflows/deploy-dev.yml` | PRs from `feature/*` |
| `staging` | **staging** (pre-prod / client preview) | `deploy-staging.yml` | PR `develop → staging` |
| `main` | **production** | `deploy-prod.yml` | PR `staging → main`, tag `vX.Y.Z` |

## Day-to-day
```bash
git checkout develop && git pull
git checkout -b feature/<area>-<slug>      # e.g. feature/tasks-recurring
# …small, frequent commits (feat:/fix:/chore:/docs:/test:)…
git push -u origin feature/<area>-<slug>
# open a PR into develop; CI (lint+build+test) must pass; merge.
```
Merging to `develop` auto-deploys to **dev**. Everything is verified there first.

## Promote
```bash
# dev looks good -> staging
#   open PR:  develop -> staging   (merge) -> auto-deploys to staging, test there
# staging signed off -> production
#   open PR:  staging -> main      (merge) -> auto-deploys to prod
git checkout main && git pull && git tag v1.2.0 && git push origin v1.2.0
```
Hotfix: branch `fix/*` off `main`, PR into `main`, then back-merge `main → develop`.

## Branch protection (set once on GitHub)
Settings → **Branches** → Add rule for **each** of `main`, `staging`, `develop`:
- ✅ Require a pull request before merging (1 approval on `main`/`staging`).
- ✅ Require status checks to pass → select **build** (the CI job); ✅ require up to date.
- ✅ Require linear history.
- ✅ Do not allow force pushes; ✅ Do not allow deletions.
- (`main` only) ✅ Restrict who can push / Include administrators.

## Environment secrets
GitHub → Settings → **Environments** → create `dev`, `staging`, `prod`; in each set
`DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY` for that environment's box.
