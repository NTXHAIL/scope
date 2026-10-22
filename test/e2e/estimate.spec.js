import { test, expect } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

async function resetPhone(page) {
  await page.goto("/");
  await page.evaluate(async () => {
    localStorage.clear();
    if (typeof window.__hailspecCloseDb === "function") await window.__hailspecCloseDb();
    await new Promise((resolve) => {
      const request = indexedDB.deleteDatabase("hailspec");
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    });
  });
  await page.reload();
}

async function addHood(page) {
  await resetPhone(page);
  await expect(page.getByRole("button", { name: "New estimate" })).toBeVisible();
  await page.getByRole("button", { name: "Edit Hood" }).click();
  await page.getByRole("option", { name: "Dime" }).click();
  await page.getByRole("button", { name: "Increase Dent count" }).click();
  await page.getByRole("button", { name: /^Save —/ }).click();
  await expect(page.getByRole("button", { name: /Hood/ }).first()).toBeVisible();
}

test("the vehicle diagram is the only way to add a panel", async ({ page }) => {
  await resetPhone(page);
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
  await expect(page.getByText("Saved on phone").first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("$80").first()).toBeVisible();
  await expect(page.getByText("Saved on phone").first()).toBeVisible();
  await expect(page.getByText(/PDR 1 dime/).first()).toBeVisible();

  await page.getByRole("button", { name: /^Review\s*\d*$/ }).click();
  await expect(page.getByRole("button", { name: "Print" })).toBeVisible();
  await page.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed += 1; }; });
  await page.getByRole("button", { name: "Print" }).click();
  await expect.poll(() => page.evaluate(() => window.__printed)).toBe(1);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".print-sheet")).toBeVisible();
  await expect(page.locator(".print-sheet")).toContainText("Preliminary Estimate");
  await expect(page.locator(".print-sheet")).toContainText("WWW.NTXHAIL.COM");
  await expect(page.locator(".print-sheet")).toContainText("PDR 1 dime");
  await expect(page.locator(".print-sheet")).toContainText("$80");
  await expect(page.locator(".print-sheet")).not.toContainText("repair estimate only");
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
  expect(bytes.includes(Buffer.from("Grand Total"))).toBe(true);
  expect(bytes.includes(Buffer.from("80.00"))).toBe(true);
  expect(bytes.includes(Buffer.from("WWW.NTXHAIL.COM"))).toBe(true);
  expect(bytes.includes(Buffer.from("repair estimate only"))).toBe(false);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "New estimate" }).first().click();
  await expect(page.getByText("Tap a panel on the vehicle to add damage.")).toBeVisible();
  await page.getByRole("button", { name: /^Saved/ }).click();
  await expect(page.getByRole("dialog", { name: "Saved estimates" })).toBeVisible();
  await expect(page.getByRole("button", { name: /\$80/ })).toBeVisible();
});

test("photos stay on the phone and a scope waits for signal", async ({ page, context }) => {
  await page.route("https://api.leadconnectorhq.com/**", (route) => route.fulfill({
    status: 200,
    contentType: "text/html",
    body: "<!doctype html><title>Form</title><p>Consent</p>",
  }));
  await page.route("**/storage/v1/object/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
  await addHood(page);
  await page.getByRole("button", { name: "Media" }).click();
  await page.getByRole("button", { name: /Hood, no photos/ }).click();
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
  const file = path.join(os.tmpdir(), `hail-dent-${process.pid}.png`);
  fs.writeFileSync(file, png);
  await page.locator("input[data-purpose=gallery]").setInputFiles(file);
  await expect(page.getByRole("button", { name: /Hood, 1 photo/ })).toBeVisible();
  await page.getByRole("button", { name: "Back to photos" }).click();
  await expect(page.getByRole("button", { name: /Hood, 1 photo/ })).toBeVisible();
  await page.goBack();
  await expect(page.getByText("Tap a panel again to change it.")).toBeVisible();
  await expect(page.getByText("PDR 1 dime").first()).toBeVisible();
  await page.goForward();
  await expect(page.getByRole("button", { name: /Hood, 1 photo/ })).toBeVisible();
  await page.getByRole("button", { name: /Hood, 1 photo/ }).click();
  await page.goBack();
  await expect(page.getByRole("button", { name: /Hood, 1 photo/ })).toBeVisible();
  await page.getByRole("button", { name: /Hood, 1 photo/ }).click();
  await page.getByLabel("Photo note").fill("Crease along the edge");
  await expect.poll(async () => page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("hailspec");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const rows = await new Promise((resolve, reject) => {
      const request = db.transaction("scopes").objectStore("scopes").getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return (rows || []).some((row) => (row.photos || []).some((photo) => photo.note === "Crease along the edge"));
  })).toBe(true);
  await page.reload();
  await page.getByRole("button", { name: "Media" }).click();
  await expect(page.getByRole("button", { name: /Hood, 1 photo/ })).toBeVisible();
  await page.getByRole("button", { name: /Hood, 1 photo/ }).click();
  await expect(page.getByLabel("Photo note")).toHaveValue("Crease along the edge");
  await page.keyboard.press("Escape");

  await context.setOffline(true);
  await page.getByRole("button", { name: /^Review/ }).click();
  await page.getByLabel("Name").fill("Ada");
  await page.getByLabel("Phone").fill("2145550100");
  await page.getByRole("button", { name: "Send to NTX Hail" }).click();
  await expect(page.getByText("Waiting for signal").first()).toBeVisible();
  await expect(page.getByRole("dialog", { name: "NTX Hail estimate form" })).toHaveCount(0);

  await context.setOffline(false);
  await expect(page.getByRole("dialog", { name: "NTX Hail estimate form" })).toBeVisible();
  await page.getByRole("button", { name: "Submitted" }).click();
  await expect(page.getByText("Sent").first()).toBeVisible();
});

test("the download page lists photos for one packet", async ({ page }) => {
  await page.route("**/storage/v1/object/public/**/manifest.json", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      vehicle: "2020 Camry",
      photos: [{ path: "media/Panels/Hood/01.jpg", tab: "Panels", tile: "Hood", kind: "image", note: "edge" }],
    }),
  }));
  await page.goto("/?packet=packet-test");
  await expect(page.getByRole("heading", { name: "Estimate download" })).toBeVisible();
  await expect(page.getByText("Panels")).toBeVisible();
  await expect(page.getByText("Hood")).toBeVisible();
  await expect(page.getByRole("button", { name: "Download all (zip)" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Download PDF" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Download", exact: true })).toBeVisible();
});

test("the cached app opens with no signal", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect(page.getByRole("button", { name: "New estimate" })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("button", { name: "New estimate" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit Hood" })).toBeVisible();
});
