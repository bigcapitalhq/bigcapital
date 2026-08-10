import { test, expect, type Locator, type Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

const ruleName = () =>
  `${faker.company.name()} Rule ${faker.string.alphanumeric(4)}`;

/**
 * Waits until the bank rules page is loaded.
 */
async function waitForBankRulesPage(page: Page) {
  await expect(page.getByTestId("dashboard-topbar").locator("h1")).toHaveText(
    "Bank Rules",
    { timeout: 30_000 },
  );
  await expect(
    page.getByRole("button", { name: "New Bank Rule" }).first(),
  ).toBeVisible({ timeout: 30_000 });
}

/**
 * Opens the new bank rule dialog.
 */
async function openNewBankRuleDialog(page: Page) {
  await page.getByRole("button", { name: "New Bank Rule" }).first().click();

  const dialog = page.getByTestId("rule-form-dialog");
  await expect(dialog).toBeVisible({ timeout: 30_000 });
  await expect(dialog.getByTestId("rule-name-input")).toBeVisible({
    timeout: 30_000,
  });

  return dialog;
}

/**
 * Opens a Blueprint select popover by its test id and picks the option whose
 * text matches the given pattern.
 */
async function selectOption(
  page: Page,
  dialog: Locator,
  selectTestId: string,
  optionText: RegExp,
) {
  await dialog.getByTestId(selectTestId).click();
  await page.getByRole("menuitem", { name: optionText }).click();
}

/**
 * Creates a bank rule through the UI and expects the success toast alongside
 * the new row in the table.
 */
async function createBankRule(
  page: Page,
  { name }: { name: string },
): Promise<Locator> {
  const dialog = await openNewBankRuleDialog(page);

  await dialog.getByTestId("rule-name-input").fill(name);
  await selectOption(page, dialog, "rule-apply-account-select", /Petty Cash/);
  await selectOption(page, dialog, "rule-apply-type-select", /Deposit/);
  await dialog
    .getByTestId("rule-condition-value-input")
    .fill(faker.lorem.word());
  await selectOption(
    page,
    dialog,
    "rule-assign-category-select",
    /Other income/,
  );
  await selectOption(
    page,
    dialog,
    "rule-assign-account-select",
    /Sales of Product Income/,
  );

  await dialog.getByRole("button", { name: "Save" }).click();

  await expect(dialog).toBeHidden({ timeout: 30_000 });
  await expect(
    page.getByText("The bank rule has been created successfully.").first(),
  ).toBeVisible({ timeout: 15_000 });

  const row = page
    .getByTestId("bank-rule-row")
    .filter({ hasText: name })
    .first();
  await expect(row).toBeVisible({ timeout: 15_000 });

  return row;
}

/**
 * Deletes the given bank rule row through the context menu and expects the
 * success toast.
 */
async function deleteBankRuleViaRow(page: Page, row: Locator) {
  await row.click({ button: "right" });
  await page.getByRole("menuitem", { name: "Delete Rule" }).click();

  await expect(page.getByTestId("bank-rule-delete-alert")).toBeVisible();
  await page
    .getByRole("dialog")
    .filter({ has: page.getByTestId("bank-rule-delete-alert") })
    .getByRole("button", { name: "Delete" })
    .click();

  await expect(
    page.getByText("The bank rule has deleted successfully."),
  ).toBeVisible({ timeout: 15_000 });
}

test.describe("bank rules", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/bank-rules");

    // The TanStack Query devtools panel (rendered in dev with `initialIsOpen`)
    // overlays the app and intercepts pointer events, blocking UI clicks.
    // Make it click-through so the tests below are not affected by it.
    await page.addStyleTag({
      content: '[class*="tsqd"] { pointer-events: none !important; }',
    });
  });

  test("should show the bank rules page.", async ({ page }) => {
    await waitForBankRulesPage(page);

    await expect(
      page.getByRole("button", { name: "New Bank Rule" }).first(),
    ).toBeVisible();
  });

  test("should validate the required fields of the new bank rule dialog.", async ({
    page,
  }) => {
    await waitForBankRulesPage(page);

    const dialog = await openNewBankRuleDialog(page);
    await dialog.getByRole("button", { name: "Save" }).click();

    await expect(dialog).toContainText("Rule name is a required field");
    await expect(dialog).toContainText("Apply to account is a required field");
    await expect(dialog).toContainText(
      "Assign to category is a required field",
    );
    await expect(dialog).toContainText("Assign to account is a required field");
    await expect(dialog).toContainText("Value is a required field");
  });

  test("should create a bank rule successfully.", async ({ page }) => {
    await waitForBankRulesPage(page);

    const name = ruleName();
    await createBankRule(page, { name });
  });

  test("should edit a bank rule successfully.", async ({ page }) => {
    await waitForBankRulesPage(page);

    const name = ruleName();
    const newName = ruleName();

    const row = await createBankRule(page, { name });

    await row.click({ button: "right" });
    await page.getByRole("menuitem", { name: "Edit Rule" }).click();

    const dialog = page.getByTestId("rule-form-dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTestId("rule-name-input")).toHaveValue(name, {
      timeout: 30_000,
    });

    await dialog.getByTestId("rule-name-input").fill(newName);
    await dialog.getByRole("button", { name: "Save" }).click();

    await expect(dialog).toBeHidden({ timeout: 30_000 });
    await expect(
      page.getByText("The bank rule has been created successfully.").first(),
    ).toBeVisible({ timeout: 15_000 });

    await expect(
      page.getByTestId("bank-rule-row").filter({ hasText: newName }).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("should delete a bank rule successfully.", async ({ page }) => {
    await waitForBankRulesPage(page);

    const name = ruleName();

    const row = await createBankRule(page, { name });
    await deleteBankRuleViaRow(page, row);

    await expect(
      page.getByTestId("bank-rule-row").filter({ hasText: name }),
    ).toHaveCount(0, { timeout: 15_000 });
  });
});
