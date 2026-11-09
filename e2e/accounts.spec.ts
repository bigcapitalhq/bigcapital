import { test, expect, type Locator, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

const ACCOUNT_TYPE = 'Expense';

const accountName = () =>
  `${faker.person.fullName()} ${faker.string.alphanumeric(4)}`;

const accountCode = () => faker.string.alphanumeric(5).toUpperCase();

/**
 * Waits until the accounts chart page is loaded.
 */
async function waitForAccountsChart(page: Page) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    'Accounts Chart',
    { timeout: 30_000 },
  );
  await expect(page.getByTestId('account-row').first()).toBeVisible({
    timeout: 30_000,
  });
}

/**
 * Opens the new account dialog.
 */
async function openNewAccountDialog(page: Page) {
  await page.getByRole('button', { name: 'New Account' }).first().click();

  const dialog = page.getByTestId('account-form-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByTestId('account-name-input')).toBeVisible({
    timeout: 30_000,
  });

  return dialog;
}

/**
 * Selects the given account type inside the account form dialog.
 *
 * The account type Select cannot be opened with a mouse click (the popover
 * only responds to keyboard input), and opening it is intermittent. Retry by
 * focusing the button, pressing Enter to open the popover, then immediately
 * clicking the matching menu item before the popover collapses.
 */
async function selectAccountType(page: Page, dialog: Locator, type: string) {
  const button = dialog.getByTestId('account-type-select');

  for (let attempt = 0; attempt < 8; attempt++) {
    await button.focus();
    await page.keyboard.press('Enter');

    const clicked = await page.evaluate((type) => {
      const items = Array.from(
        document.querySelectorAll('[data-testId="account-type-option"]'),
      );
      for (const item of items) {
        if ((item as HTMLElement).innerText.trim().startsWith(type)) {
          (item as HTMLElement).click();
          return true;
        }
      }
      return false;
    }, type);

    if (clicked) {
      await expect(button).toContainText(type, { timeout: 5_000 });
      return;
    }
    await page.keyboard.press('Escape');
  }
  throw new Error(`Failed to select the ${type} account type.`);
}

/**
 * Creates an account through the UI and expects the success toast.
 */
async function createAccount(
  page: Page,
  {
    name,
    code,
    type = ACCOUNT_TYPE,
  }: { name: string; code: string; type?: string },
) {
  const dialog = await openNewAccountDialog(page);

  await selectAccountType(page, dialog, type);
  await dialog.getByTestId('account-name-input').fill(name);
  await dialog.getByTestId('account-code-input').fill(code);
  await dialog.getByRole('button', { name: 'Submit' }).click();

  await expect(dialog).toBeHidden({ timeout: 30_000 });
  await expect(page.getByText(`${code} - ${name}`)).toBeVisible({
    timeout: 15_000,
  });
}

/**
 * Filters the accounts table by the given account name and returns the
 * matching row locator. The accounts table is virtualized so filtering is the
 * only reliable way to surface a specific account row.
 */
async function filterAccountsBy(page: Page, text: string) {
  await page.getByRole('button', { name: /filter|filters applied/i }).click();
  await page.getByPlaceholder('Value').first().fill(text);

  const row = page.getByTestId('account-row').filter({ hasText: text }).first();
  await expect(row).toBeVisible({ timeout: 30_000 });

  // Close the filter popover before interacting with the table.
  await page.keyboard.press('Escape');

  return row;
}

/**
 * Deletes the given account row through the context menu and expects the
 * success toast.
 */
async function deleteAccountViaRow(page: Page, row: Locator) {
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Delete Account' }).click();

  await expect(page.getByTestId('account-delete-alert')).toBeVisible();
  await page
    .getByRole('dialog')
    .filter({ hasText: 'Once you delete this account' })
    .getByRole('button', { name: 'Delete' })
    .click();

  await expect(
    page.getByText('The account has been successfully deleted'),
  ).toBeVisible({ timeout: 15_000 });
}

test.describe('accounts chart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accounts');
  });

  test('should show the accounts chart page.', async ({ page }) => {
    await waitForAccountsChart(page);

    await expect(
      page.getByRole('button', { name: 'New Account' }),
    ).toBeVisible();
    await expect(
      page.getByTestId('account-row').filter({ hasText: 'Petty Cash' }),
    ).toBeVisible();
  });

  test('should validate the required fields of the new account dialog.', async ({
    page,
  }) => {
    await waitForAccountsChart(page);

    const dialog = await openNewAccountDialog(page);
    await dialog.getByRole('button', { name: 'Submit' }).click();

    await expect(dialog).toContainText('Account name is a required field');
    await expect(dialog).toContainText('Account Type is a required field');
  });

  test('should create an account successfully.', async ({ page }) => {
    await waitForAccountsChart(page);

    const name = accountName();
    const code = accountCode();

    await createAccount(page, { name, code });

    const row = await filterAccountsBy(page, name);
    await expect(row).toContainText(code, { timeout: 15_000 });
  });

  test('should edit an account successfully.', async ({ page }) => {
    await waitForAccountsChart(page);

    const name = accountName();
    const newName = accountName();
    const code = accountCode();

    await createAccount(page, { name, code });

    const row = await filterAccountsBy(page, name);
    await row.click({ button: 'right' });
    await page.getByRole('menuitem', { name: 'Edit Account' }).click();

    const dialog = page.getByTestId('account-form-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTestId('account-name-input')).toHaveValue(name, {
      timeout: 30_000,
    });

    await dialog.getByTestId('account-name-input').fill(newName);
    await dialog.getByRole('button', { name: 'Edit' }).click();

    await expect(dialog).toBeHidden({ timeout: 30_000 });
    await expect(page.getByText(`${code} - ${newName}`)).toBeVisible({
      timeout: 15_000,
    });

    await filterAccountsBy(page, newName);
  });

  test('should delete an account successfully.', async ({ page }) => {
    await waitForAccountsChart(page);

    const name = accountName();
    const code = accountCode();

    await createAccount(page, { name, code });

    const row = await filterAccountsBy(page, name);
    await deleteAccountViaRow(page, row);
  });
});
