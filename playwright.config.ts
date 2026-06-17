import { defineConfig } from "@playwright/test";
// E2E smoke tests run against a RUNNING local suite (bash scripts/dev.sh + Caddy).
// Not part of CI (which has no live stack). Run with: npm run e2e
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  reporter: "list",
  use: { baseURL: process.env.E2E_BASE || "https://admin.maplefurnishers.com", ignoreHTTPSErrors: true },
});
