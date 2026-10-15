import { defineConfig, devices } from "@playwright/test";

const chrome = { browserName: "chromium", channel: "chrome" };

export default defineConfig({
  testDir: "test/e2e",
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:8766",
    ...chrome,
    trace: "off",
  },
  webServer: {
    command: "python3 -m http.server 8766",
    port: 8766,
    reuseExistingServer: true,
    cwd: ".",
  },
  projects: [
    { name: "iphone", use: { ...devices["iPhone 13"], ...chrome } },
    { name: "pixel", use: { ...devices["Pixel 7"], ...chrome } },
    { name: "desktop", use: { ...chrome, viewport: { width: 1280, height: 800 } } },
  ],
});
