import { test, expect, type Page } from "@playwright/test";
import {
  authCookies,
  createOnboardedUser,
  type OnboardedSession,
} from "./_auth";

const API_BASE =
  process.env.PLAYWRIGHT_TEST_API_URL ||
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
  "http://localhost:3000";

const WEBAPP_BASE =
  process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:4000";

/**
 * Waits until the preview of the selected template is shown.
 */
async function waitForPreview(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Chart of Accounts", exact: true }),
  ).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("table")).toBeVisible({ timeout: 30_000 });
}

// Applying a template renumbers the whole chart, and other specs post to
// accounts of the shared org by name, so this suite onboards its own org.
test.describe.serial("chart of accounts templates", () => {
  let session: OnboardedSession;

  test.beforeAll(async () => {
    session = await createOnboardedUser(API_BASE, {
      location: "US",
      baseCurrency: "USD",
      timezone: "America/New_York",
      fiscalYear: "january",
    });
  });

  test.beforeEach(async ({ page, context }) => {
    await context.addCookies(
      authCookies(session, new URL(WEBAPP_BASE).hostname),
    );
    await page.goto("/preferences/chart-of-accounts");
    await waitForPreview(page);
  });

  test("should preview the template before applying it.", async ({ page }) => {
    await expect(page.getByRole("combobox")).toHaveValue("united-states");
    await expect(
      page.getByRole("radio", { name: /^Corporation/ }),
    ).toBeChecked();
    await expect(page.getByText(/\d+ to update, \d+ to add/)).toBeVisible();

    const bank = page.getByRole("row", { name: /Business Checking/ });
    await expect(bank).toContainText("10001");
    await expect(bank).toContainText("1010");

    await expect(
      page.getByRole("button", { name: "Apply template" }),
    ).toBeEnabled();
  });

  test("should follow the legal structure.", async ({ page }) => {
    // Blueprint's control indicator covers the input; click the label as a
    // user would.
    await page.getByText("Sole proprietorship or single-member LLC").click();
    await expect(
      page.getByRole("radio", { name: /^Sole proprietorship/ }),
    ).toBeChecked();

    await expect(page.getByRole("row", { name: /Owner's Draw/ })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("should write nothing when the confirmation is cancelled.", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Apply template" }).click();

    const alert = page.getByRole("dialog");
    await expect(alert).toContainText("Apply the United States template?");
    await alert.getByRole("button", { name: "Cancel" }).click();
    await expect(alert).toBeHidden();

    await page.reload();
    await waitForPreview(page);
    await expect(page.getByText(/\d+ to update, \d+ to add/)).toBeVisible();
  });

  test("should apply the template.", async ({ page }) => {
    await page.getByRole("button", { name: "Apply template" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Apply template" })
      .click();

    await expect(
      page.getByText("The chart of accounts has been updated", {
        exact: false,
      }),
    ).toBeVisible({ timeout: 30_000 });
    await expect(
      page.getByText("The chart of accounts already matches this template."),
    ).toBeVisible({ timeout: 30_000 });
    await expect(
      page.getByRole("button", { name: "Apply template" }),
    ).toBeDisabled();

    // The accounts table is virtualized and lists newest first, so check the
    // renumbered system account through the API instead.
    const response = await page.request.get(
      `${API_BASE}/api/accounts?structure=flat`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "organization-id": session.organizationId,
        },
      },
    );
    const body = await response.json();

    expect(body.accounts ?? body).toContainEqual(
      expect.objectContaining({
        slug: "bank-account",
        code: "1010",
        name: "Business Checking",
      }),
    );
  });
});
