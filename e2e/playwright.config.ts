import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  // Generous: `next dev` compiles each route on first hit.
  timeout: Number(process.env.E2E_TIMEOUT ?? 120_000),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    // Set E2E_CHANNEL=chrome to use an installed Chrome instead of the bundled Chromium.
    channel: process.env.E2E_CHANNEL || undefined,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
