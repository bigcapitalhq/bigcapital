import { expect, type Page } from '@playwright/test';

export const PAYMENT_ACCOUNT = 'Petty Cash';
export const EXPENSE_ACCOUNT = 'Rent';

/**
 * Waits until the expenses list page is loaded.
 */
export async function waitForExpensesPage(page: Page) {
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
export async function waitForExpenseFormPage(page: Page, title: string) {
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
export async function selectPaymentAccount(page: Page, name: string) {
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
export async function selectEntryAccount(page: Page, name: string) {
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
export async function fillEntryAmount(page: Page, amount: number) {
  const input = page.getByTestId('expense-entry-amount-input').first();
  await input.click();
  await input.fill(String(amount));
  await input.press('Tab');
}

/**
 * Creates an expense through the UI and expects the success toast alongside
 * the redirect back to the expenses list page.
 */
export async function createExpense(
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
