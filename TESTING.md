# Testing

- **Unit / component (Vitest):** `npm test` (watch: `npm run test:watch`). Runs in CI.
  Files: `*.test.ts` (node) and `*.test.tsx` (jsdom, add `// @vitest-environment jsdom`).
  Covers pure logic in `@maple/core` (rbac, session, utils) and UI components.
- **End-to-end (Playwright):** `npm run e2e` — runs against a **running** local suite
  (`bash scripts/dev.sh` + Caddy). Smoke tests live in `e2e/`. Not in CI (no live stack).
  First time: `npx playwright install chromium`.

Add a unit test next to the code it covers; add an e2e smoke for each critical user flow.
