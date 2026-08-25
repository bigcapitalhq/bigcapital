import { test, expect, type Locator, type Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
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

const branchName = () =>
  `${faker.company.name()} ${faker.string.alphanumeric(4)}`;

const branchCode = () => faker.string.alphanumeric(5).toUpperCase();

/**
 * Waits until the branches preferences page is loaded.
 */
async function waitForBranchesPage(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Branches", exact: true }),
  ).toBeVisible({
    timeout: 30_000,
  });
}

/**
 * Waits until the branches page settles into either the "not activated"
 * (empty status with activate button) or "activated" (data table with the new
 * branch button) state and returns whether the feature still needs to be
 * activated. Keeps the activation test re-runnable against an org that has
 * already activated the feature.
 */
async function waitForBranchesState(page: Page): Promise<boolean> {
  const activateButton = page.getByRole("button", {
    name: "Activate Branches",
  });
  const newBranchButton = page.getByRole("button", { name: "New Branch" });

  await Promise.race([
    activateButton.waitFor({ state: "visible", timeout: 30_000 }),
    newBranchButton.waitFor({ state: "visible", timeout: 30_000 }),
  ]);

  return activateButton.isVisible().catch(() => false);
}

/**
 * Opens the new branch dialog.
 */
async function openNewBranchDialog(page: Page): Promise<Locator> {
  await page.getByRole("button", { name: "New Branch" }).click();

  const dialog = page.getByTestId("branch-form-dialog");
  await expect(dialog).toBeVisible({ timeout: 30_000 });
  await expect(dialog.locator('input[name="name"]')).toBeVisible({
    timeout: 30_000,
  });

  return dialog;
}

/**
 * Creates a branch through the UI. The dialog closing signals the mutation
 * succeeded (toasts render unreliably in the dev SPA, so they aren't asserted
 * here); callers verify the resulting row instead.
 */
async function createBranch(
  page: Page,
  { name, code }: { name: string; code: string },
) {
  const dialog = await openNewBranchDialog(page);

  await dialog.locator('input[name="name"]').fill(name);
  await dialog.locator('input[name="code"]').fill(code);

  await dialog.getByRole("button", { name: "Save" }).click();

  await expect(dialog).toBeHidden({ timeout: 15_000 });
}

/**
 * Locates the branches table row matching the given branch name.
 */
async function findBranchRow(page: Page, name: string): Promise<Locator> {
  const row = page.getByTestId("branch-row").filter({ hasText: name }).first();
  await expect(row).toBeVisible({ timeout: 15_000 });
  return row;
}

/**
 * Deletes the given branch row through the context menu. The caller verifies
 * the row disappears afterwards.
 */
async function deleteBranchViaRow(page: Page, row: Locator) {
  await row.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Delete Branch" }).click();

  await expect(page.getByTestId("branch-delete-alert")).toBeVisible();
  await page
    .getByRole("dialog")
    .filter({ has: page.getByTestId("branch-delete-alert") })
    .getByRole("button", { name: "Delete" })
    .click();
}

test.describe("branches", () => {
  test.describe.configure({ mode: "serial" });

  // Activating the branches feature has global side effects on an
  // organization (e.g. expenses start requiring a branch id). The shared
  // storage state org is used by every spec to seed report data, so this
  // suite runs against its own dedicated org to avoid polluting it.
  let session: OnboardedSession;

  test.beforeAll(async () => {
    session = await createOnboardedUser(API_BASE);
  });

  test.beforeEach(async ({ page, context }) => {
    await context.addCookies(
      authCookies(session, new URL(WEBAPP_BASE).hostname),
    );
    await page.goto("/preferences/branches");
    await waitForBranchesPage(page);
  });

  test("should activate the branches feature.", async ({ page }) => {
    const needsActivation = await waitForBranchesState(page);

    if (needsActivation) {
      await page.getByRole("button", { name: "Activate Branches" }).click();

      const dialog = page.getByRole("dialog");
      await expect(dialog).toContainText(
        "The current organization will be considered as the Head Office or Primary Branch.",
        { timeout: 30_000 },
      );
      await dialog.getByRole("button", { name: "Activate Branches" }).click();
    }

    // The primary head branch is created as part of the activation.
    await expect(
      page.getByTestId("branch-row").filter({ hasText: "Head Branch" }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByRole("button", { name: "New Branch" }),
    ).toBeVisible();
  });

  test("should show the branches page.", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "New Branch" }),
    ).toBeVisible();

    await expect(
      page.getByTestId("branch-row").filter({ hasText: "Head Branch" }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("should validate the required fields of the new branch dialog.", async ({
    page,
  }) => {
    const dialog = await openNewBranchDialog(page);

    await dialog.getByRole("button", { name: "Save" }).click();

    await expect(dialog).toContainText(/required field/i, {
      timeout: 15_000,
    });
  });

  test("should create a branch successfully.", async ({ page }) => {
    const name = branchName();
    const code = branchCode();

    await createBranch(page, { name, code });

    const row = await findBranchRow(page, name);
    await expect(row).toContainText(code, { timeout: 15_000 });
  });

  test("should edit a branch successfully.", async ({ page }) => {
    const name = branchName();
    const newName = branchName();

    await createBranch(page, { name, code: branchCode() });

    const row = await findBranchRow(page, name);
    await row.click({ button: "right" });
    await page.getByRole("menuitem", { name: "Edit Branch" }).click();

    const dialog = page.getByTestId("branch-form-dialog");
    await expect(dialog).toBeVisible({ timeout: 30_000 });
    await expect(dialog.locator('input[name="name"]')).toHaveValue(name, {
      timeout: 30_000,
    });

    await dialog.locator('input[name="name"]').fill(newName);

    await dialog.getByRole("button", { name: "Save" }).click();

    // The edit mutation shares the same success toast as create, so the
    // reliable signal is the dialog closing and the row reflecting the change.
    await expect(dialog).toBeHidden({ timeout: 15_000 });

    await findBranchRow(page, newName);
  });

  test("should delete a branch successfully.", async ({ page }) => {
    const name = branchName();

    await createBranch(page, { name, code: branchCode() });

    const row = await findBranchRow(page, name);
    await deleteBranchViaRow(page, row);

    await expect(
      page.getByTestId("branch-row").filter({ hasText: name }),
    ).toHaveCount(0, { timeout: 15_000 });
  });

  test("should mark a branch as primary.", async ({ page }) => {
    const name = branchName();

    await createBranch(page, { name, code: branchCode() });

    const row = await findBranchRow(page, name);
    await row.click({ button: "right" });
    await page.getByRole("menuitem", { name: "Make as Primary" }).click();

    // The primary branch is rendered with a star icon next to its name.
    await expect(row.locator('[data-icon="star-18dp"]')).toBeVisible({
      timeout: 15_000,
    });
  });
});
