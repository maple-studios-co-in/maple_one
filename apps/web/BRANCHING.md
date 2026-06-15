# Branching & commits

## Branches
- **main** — always releasable; tagged releases.
- **develop** — integration branch; features merge here first.
- **feature/<name>** — one branch per phase/feature, branched from `develop`,
  merged back via PR (squash or `--no-ff`).
- **fix/<name>** — bug fixes off `develop`.

Flow: `feature/* → develop → main`.

## Commits — Conventional Commits
`type(scope): summary`

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `perf`, `test`.
Examples:
- `feat(sofa): add "long view" scroll chapter`
- `refactor(showcase): extract ScrollScrubShowcase config API`
- `chore(repo): init git + branch strategy`

Keep commits small and logically scoped; subject in imperative mood, ≤72 chars.

## Phase branches (per SITE_PLAN.md)
- `feature/phase-a-shell` — nav, scroll progress, Hero/Ethos/Studio/Visit chapters
- `feature/sofa-longview`
- `feature/table-set`
- `feature/dining-gather`
- `feature/polish` — mobile, reduced-motion, perf
