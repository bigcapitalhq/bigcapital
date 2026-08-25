import { test, expect, type Locator, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import {
  createExpense,
  waitForExpensesPage,
  waitForExpenseFormPage,
} from './_expenses';

const referenceNo = () => `EXP-${faker.string.alphanumeric(6).toUpperCase()}`;

const expenseAmount = () => faker.number.int({ min: 1000, max: 50000 });

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
