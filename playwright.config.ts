import path from "path";
import { PlaywrightTestConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  // Timeout per test
  timeout: 60 * 1000,
  workers: 1,
  // Test directory
  testDir: path.join(__dirname, "e2e"),
  // Runs once before the suite: registers + onboards a user via API and
  // persists the authenticated session to `e2e/.auth/user.json`.
  globalSetup: path.join(__dirname, "e2e/global-setup.ts"),
  // If a test fails, retry it additional 2 times
  retries: 0,
  // Artifacts folder where screenshots, videos, and traces are stored.
  outputDir: "test-results/",
  use: {
    // Match the `data-testId` attributes used across the webapp.
    testIdAttribute: "data-testId",

    // Retry a test if its failing with enabled tracing. This allows you to analyse the DOM, console logs, network traffic etc.
    // More information: https://playwright.dev/docs/trace-viewer
    trace: "retain-on-failure",

    // All available context options: https://playwright.dev/docs/api/class-browser#browser-new-context
    // contextOptions: {
    //   ignoreHTTPSErrors: true,
    // },
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:4000",

    // Shared authenticated + onboarded session (created by globalSetup).
    // Override per-spec with `test.use({ storageState: undefined })`.
    storageState: "e2e/.auth/user.json",
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
};
export default config;
