// Auto-capture docs screenshots from the RUNNING local suite.
//
//   npm i -D playwright -w maple-suite        # once
//   npx playwright install chromium           # once (downloads the browser)
//   node scripts/screenshots.mjs              # with the suite + Caddy running
//
// Logs in once, visits each tool over the local *.maplefurnishers.com proxy
// (cookie is shared across subdomains), and writes PNGs into
// apps/docs/public/shots/<slug>/<name>.png — exactly where the guides expect them.
// Re-run any time the UI changes.

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HOST = process.env.SHOTS_DOMAIN || "maplefurnishers.com";
const EMAIL = process.env.SHOTS_EMAIL || "admin@maplefurnishers.com";
const PASSWORD = process.env.SHOTS_PASSWORD || "maple@123";
const OUT = "apps/docs/public/shots";
const u = (sub, path = "/") => `https://${sub}.${HOST}${path}`;

// [slug, name, subdomain, path, optional prep(page)]
const jobs = [
  ["getting-started", "launcher", "admin", "/"],
  ["getting-started", "shell", "leads", "/"],
  ["leads", "overview", "leads", "/"],
  ["crm", "overview", "crm", "/"],
  ["quotations", "overview", "quotations", "/"],
  ["quotations", "rooms", "quotations", "/", async (p) => { await p.getByText("Rooms & Items").first().click().catch(() => {}); }],
  ["quotations", "finance", "quotations", "/", async (p) => { await p.getByText("Finance & T&C").first().click().catch(() => {}); }],
  ["tasks", "overview", "tasks", "/"],
  ["orders", "overview", "orders", "/"],
  ["challans", "overview", "challans", "/"],
  ["invoices", "overview", "invoices", "/"],
  ["payments", "overview", "payments", "/"],
  ["catalog", "overview", "catalog", "/"],
  ["photoshoot", "overview", "photoshoot", "/"],
  ["inventory", "overview", "inventory", "/"],
  ["purchase-orders", "overview", "purchase-orders", "/"],
  ["price-list", "overview", "price-list", "/"],
  ["finance", "overview", "finance", "/"],
  ["expenses", "overview", "expenses", "/"],
  ["hr", "overview", "hr", "/"],
  ["users", "overview", "users", "/"],
  ["users", "roles", "users", "/", async (p) => { await p.getByRole("button", { name: /roles/i }).first().click().catch(() => {}); }],
];

const shot = async (page, slug, name) => {
  const file = join(OUT, slug, `${name}.png`);
  mkdirSync(dirname(file), { recursive: true });
  await page.screenshot({ path: file });
  console.log("captured", file);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

// login page screenshot first, then sign in
await page.goto(u("admin", "/login"), { waitUntil: "networkidle" });
await shot(page, "getting-started", "login");
await page.fill('input[type="email"]', EMAIL);
await page.fill('input[type="password"]', PASSWORD);
await Promise.all([page.waitForLoadState("networkidle").catch(() => {}), page.click('button[type="submit"]')]);
await page.waitForTimeout(1500);

for (const [slug, name, sub, path, prep] of jobs) {
  try {
    await page.goto(u(sub, path), { waitUntil: "networkidle", timeout: 25000 });
    if (prep) { await prep(page); await page.waitForTimeout(900); }
    await page.waitForTimeout(700);
    await shot(page, slug, name);
  } catch (e) { console.warn("skip", slug, name, "-", e.message); }
}
await browser.close();
console.log("\nDone. Reload docs.maplefurnishers.com to see the screenshots.");
