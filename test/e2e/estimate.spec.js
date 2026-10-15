import { test, expect } from "@playwright/test";
import fs from "node:fs";

async function addHood(page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByRole("button", { name: "New estimate" })).toBeVisible();
  await page.getByRole("button", { name: "Edit Hood" }).click();
  await page.getByRole("button", { name: "1 - 5 dents", exact: true }).click();
  await page.getByRole("button", { name: /^Save —/ }).click();
  await expect(page.getByRole("button", { name: /Hood/ }).first()).toBeVisible();
}

test("the vehicle diagram is the only way to add a panel", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByText("Or pick a panel")).toHaveCount(0);
  await expect(page.getByText("Tap a panel on the vehicle to add damage.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to NTX Hail" })).toHaveAttribute("href", "https://www.ntxhail.com");
  const fit = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(fit.scroll).toBeLessThanOrEqual(fit.client + 1);
});

test("a hood estimate autosaves, prints, downloads a PDF, and can start fresh", async ({ page }) => {
  await page.addInitScript(() => {
    navigator.canShare = () => false;
  });
  await addHood(page);
  await expect(page.getByText("$80").first()).toBeVisible();
  await expect(page.getByText("Saved on this phone")).toBeVisible();
  await page.reload();
  await expect(page.getByText("$80").first()).toBeVisible();
  await expect(page.getByText("Saved on this phone")).toBeVisible();

  await page.getByRole("button", { name: /^Review\s*\d*$/ }).click();
  await expect(page.getByRole("button", { name: "Print" })).toBeVisible();
  await page.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed += 1; }; });
  await page.getByRole("button", { name: "Print" }).click();
  await expect.poll(() => page.evaluate(() => window.__printed)).toBe(1);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".print-sheet")).toBeVisible();
  await expect(page.locator(".print-sheet")).toContainText("Hood");
  await expect(page.locator(".print-sheet")).toContainText("$80");
  await expect(page.locator(".print-sheet")).toContainText("repair estimate only");
  await expect(page.locator(".app-screen")).toBeHidden();
  await page.emulateMedia({ media: "screen" });

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download PDF" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  const filePath = await download.path();
  const bytes = fs.readFileSync(filePath);
  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
  expect(bytes.includes(Buffer.from("Grand total: $80"))).toBe(true);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "New estimate" }).first().click();
  await expect(page.getByText("Tap a panel on the vehicle to add damage.")).toBeVisible();
  await page.getByRole("button", { name: /^Saved/ }).click();
  await expect(page.getByRole("dialog", { name: "Saved estimates" })).toBeVisible();
  await expect(page.getByRole("button", { name: /\$80/ })).toBeVisible();
});
