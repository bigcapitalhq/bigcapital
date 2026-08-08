import { test, expect, type Locator, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

const PAYMENT_ACCOUNT = 'Petty Cash';
const EXPENSE_ACCOUNT = 'Rent';

const referenceNo = () => `EXP-${faker.string.alphanumeric(6).toUpperCase()}`;

const expenseAmount = () => faker.number.int({ min: 1000, max: 50000 });

/**
 * Waits until the expenses list page is loaded.
 */
async function waitForExpensesPage(page: Page) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    'Expenses List',
    { timeout: 30_000 },
  );
  await expect(
    page.getByRole('button', { name: 'New Expense' }).first(),
  ).toBeVisible({ timeout: 30_000 });
}

/**
 * Waits until the expense form page is loaded for the given title
 * (new or edit).
 */
async function waitForExpenseFormPage(page: Page, title: string) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    title,
    { timeout: 30_000 },
  );
  await expect(page.getByTestId('expense-payment-account-select')).toBeVisible({
    timeout: 30_000,
  });
}

/**
 * Selects the given payment account inside the expense form.
 *
 * The payment account Select popover cannot be opened reliably with a plain
 * mouse click, so it is retried the same way the account type select does:
 * focus the trigger, press Enter to open the popover, then immediately click
 * the matching menu item before the popover collapses.
 */
async function selectPaymentAccount(page: Page, name: string) {
  const button = page.getByTestId('expense-payment-account-select');

  for (let attempt = 0; attempt < 8; attempt++) {
    await button.focus();
    await page.keyboard.press('Enter');

    const clicked = await page.evaluate((accountName) => {
      const items = Array.from(
        document.querySelectorAll('[role="menuitem"]'),
      );
      const item = items.find((el) =>
        (el as HTMLElement).innerText.includes(accountName),
      );
      if (item) {
        (item as HTMLElement).click();
        return true;
      }
      return false;
    }, name);

    if (clicked) {
      await expect(button).toContainText(name, { timeout: 5_000 });
      return;
    }
    await page.keyboard.press('Escape');
  }
  throw new Error(`Failed to select the ${name} payment account.`);
}

/**
 * Selects the given expense category account inside the entries table.
 */
async function selectEntryAccount(page: Page, name: string) {
  const input = page.getByPlaceholder('Search...').first();
  await input.click();
  await input.pressSequentially(name);

  const item = page.getByRole('menuitem', { name: new RegExp(name) }).first();
  await expect(item).toBeVisible({ timeout: 10_000 });
  await item.click();
}

/**
 * Fills the amount of the first entries table row.
 */
async function fillEntryAmount(page: Page, amount: number) {
  const input = page.getByTestId('expense-entry-amount-input').first();
  await input.click();
  await input.fill(String(amount));
  await input.press('Tab');
}

/**
 * Creates an expense through the UI and expects the success toast alongside
 * the redirect back to the expenses list page.
 */
async function createExpense(
  page: Page,
  {
    referenceNo,
    amount,
    paymentAccount = PAYMENT_ACCOUNT,
    expenseAccount = EXPENSE_ACCOUNT,
  }: {
    referenceNo: string;
    amount: number;
    paymentAccount?: string;
    expenseAccount?: string;
  },
) {
  await page.getByRole('button', { name: 'New Expense' }).first().click();
  await waitForExpenseFormPage(page, 'New Expense');

  await selectPaymentAccount(page, paymentAccount);
  await page.getByTestId('expense-reference-no-input').fill(referenceNo);
  await selectEntryAccount(page, expenseAccount);
  await fillEntryAmount(page, amount);

  await page.getByRole('button', { name: 'Save and Publish' }).click();

  await expect(
    page.getByText(/The expense #\d+ has been created successfully\./),
  ).toBeVisible({ timeout: 15_000 });

  await waitForExpensesPage(page);
}

/**
 * Filters the expenses table by the given reference no and returns the
 * matching row locator. The reference no is unique per test, so the filtered
 * table holds a single row.
 */
async function filterExpensesByRef(page: Page, refNo: string) {
  await page.getByRole('button', { name: /filter|filters applied/i }).click();
  await page.getByPlaceholder('Value').first().fill(refNo);

  const row = page.getByTestId('expense-row').first();
  await expect(row).toBeVisible({ timeout: 30_000 });

  // Close the filter popover before interacting with the table.
  await page.keyboard.press('Escape');

  return row;
}

/**
 * Deletes the given expense row through the context menu and expects the
 * success toast.
 */
async function deleteExpenseViaRow(page: Page, row: Locator) {
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Delete Expense' }).click();

  await expect(page.getByTestId('expense-delete-alert')).toBeVisible();
  await page
    .getByRole('dialog')
    .filter({ has: page.getByTestId('expense-delete-alert') })
    .getByRole('button', { name: 'Delete' })
    .click();

  await expect(
    page.getByText('The expense has been deleted successfully'),
  ).toBeVisible({ timeout: 15_000 });
}

test.describe('expenses', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/expenses');
  });

  test('should show the expenses page.', async ({ page }) => {
    await waitForExpensesPage(page);

    await expect(
      page.getByRole('button', { name: 'New Expense' }).first(),
    ).toBeVisible();
  });

  test('should validate the required fields of the new expense form.', async ({
    page,
  }) => {
    await waitForExpensesPage(page);

    await page.getByRole('button', { name: 'New Expense' }).first().click();
    await waitForExpenseFormPage(page, 'New Expense');

    await page.getByRole('button', { name: 'Save and Publish' }).click();

    await expect(
      page.getByText('Payment account is a required field'),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('should create an expense successfully.', async ({ page }) => {
    await waitForExpensesPage(page);

    const ref = referenceNo();
    const amount = expenseAmount();

    await createExpense(page, { referenceNo: ref, amount });
    await filterExpensesByRef(page, ref);
  });

  test('should edit an expense successfully.', async ({ page }) => {
    await waitForExpensesPage(page);

    const ref = referenceNo();
    const newRef = referenceNo();
    const amount = expenseAmount();

    await createExpense(page, { referenceNo: ref, amount });

    const row = await filterExpensesByRef(page, ref);
    await row.click({ button: 'right' });
    await page.getByRole('menuitem', { name: 'Edit Expense' }).click();

    await waitForExpenseFormPage(page, 'Edit Expense');
    await expect(page.getByTestId('expense-reference-no-input')).toHaveValue(
      ref,
      { timeout: 30_000 },
    );

    await page.getByTestId('expense-reference-no-input').fill(newRef);
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    await expect(
      page.getByText(/The expense #\d+ has been edited successfully\./),
    ).toBeVisible({ timeout: 15_000 });

    await waitForExpensesPage(page);

    await filterExpensesByRef(page, newRef);

    // The previous reference no should no longer match any expense.
    await page.getByRole('button', { name: /filter|filters applied/i }).click();
    await page.getByPlaceholder('Value').first().fill(ref);
    await expect(page.getByTestId('expense-row')).toHaveCount(0, {
      timeout: 15_000,
    });
  });

  test('should delete an expense successfully.', async ({ page }) => {
    await waitForExpensesPage(page);

    const ref = referenceNo();
    const amount = expenseAmount();

    await createExpense(page, { referenceNo: ref, amount });

    const row = await filterExpensesByRef(page, ref);
    await deleteExpenseViaRow(page, row);

    await expect(page.getByTestId('expense-row')).toHaveCount(0, {
      timeout: 15_000,
    });
  });
});
