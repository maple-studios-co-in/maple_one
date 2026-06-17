import { test, expect } from "@playwright/test";

test("admin can sign in and reach the launcher", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[type="email"]', process.env.E2E_EMAIL || "admin@maplefurnishers.com");
  await page.fill('input[type="password"]', process.env.E2E_PASSWORD || "maple@123");
  await page.click('button[type="submit"]');
  await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 15_000 });
});

test("an unauthenticated tool redirects to the central login", async ({ page }) => {
  const res = await page.goto("https://leads.maplefurnishers.com/", { waitUntil: "domcontentloaded" });
  expect(page.url()).toContain("admin.maplefurnishers.com/login");
});
