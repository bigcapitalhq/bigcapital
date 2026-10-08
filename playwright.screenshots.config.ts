import path from "path";
import { PlaywrightTestConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, ".env") });

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  // Onboarding + demo data seeding happen in a beforeAll hook.
  timeout: 120 * 1000,
  workers: 1,
  testDir: path.join(__dirname, "e2e/screenshots"),
  // Runs once before the suite: registers + onboards a user via API and
  // persists the authenticated session to `e2e/.auth/user.json`.
  globalSetup: path.join(__dirname, "e2e/global-setup.ts"),
  retries: 0,
  outputDir: "test-results/screenshots/",
  use: {
    testIdAttribute: "data-testId",
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:4000",
    storageState: "e2e/.auth/user.json",
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1540, height: 839 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
        contextOptions: { reducedMotion: "reduce" },
      },
    },
  ],
};
export default config;
