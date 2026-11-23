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
 * Select the account type through the dialog's dropdown.
 */
async function selectAccountType(page: Page, dialog: Locator, type: string) {
  const button = dialog.getByTestId('account-type-select');
  await button.click();
  await page.getByTestId('account-type-option').getByText(type, { exact: true }).first().click();
  await expect(button).toContainText(type);
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

  await dialog.getByTestId('account-name-input').fill(name);
  // Opening the picker blurs and validates the name. Its menu must stay open.
  await selectAccountType(page, dialog, type);
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
  await Promise.all([
    page.waitForResponse((response) => {
      const url = new URL(response.url());
      return (
        url.pathname === '/api/accounts' &&
        !!url.searchParams.get('stringified_filter_roles')?.includes(text)
      );
    }),
    page.getByPlaceholder('Value').first().fill(text),
  ]);

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
    .getByRole('alertdialog')
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
    const id = await row.getAttribute('data-account-id');
    await expect(
      page.locator(`[data-account-id="${id}"]`).getByText(code, { exact: true }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('opens and bulk-selects the intended child account', async ({ page }) => {
    await waitForAccountsChart(page);
    const name = accountName();
    const childName = `${name} child`;
    await createAccount(page, { name, code: accountCode() });
    const parent = await filterAccountsBy(page, name);
    await parent.click({ button: 'right' });
    await page.getByRole('menuitem', { name: 'New Child Account' }).click();

    const dialog = page.getByTestId('account-form-dialog');
    await dialog.getByTestId('account-name-input').fill(childName);
    await dialog.getByTestId('account-code-input').fill(accountCode());
    await dialog.getByRole('button', { name: 'Submit' }).click();
    await expect(dialog).toBeHidden();

    const child = page.getByTestId('account-row').filter({ hasText: childName });
    await parent.getByRole('button', { name: /expand row/i }).click();
    await expect(child).toBeVisible();
    await expect(page.locator('.drawer-portal')).toBeHidden();
    await page.getByRole('button', { name: 'Collapse all accounts' }).click();
    await expect(child).toBeHidden();
    await page.getByRole('button', { name: 'Expand all accounts' }).click();
    await expect(child).toBeVisible();

    const id = await child.getAttribute('data-account-id');
    const [details] = await Promise.all([
      page.waitForResponse(
        (response) => new URL(response.url()).pathname === `/api/accounts/${id}`,
      ),
      child.click(),
    ]);
    expect(details.ok()).toBeTruthy();
    await expect(page.locator('.drawer-portal')).toContainText(childName);
    await page.keyboard.press('Escape');

    const childCheckbox = page.getByRole('checkbox', {
      name: 'Select row 2',
      exact: true,
    });
    await childCheckbox.press('Space');
    await expect(childCheckbox).toBeChecked();
    await page.getByRole('button', { name: 'Inactivate', exact: true }).click();
    const [bulkRequest] = await Promise.all([
      page.waitForRequest('**/api/accounts/bulk-inactivate'),
      page.getByRole('button', { name: 'Inactivate (1)', exact: true }).click(),
    ]);
    expect(bulkRequest.postDataJSON().ids).toEqual([Number(id)]);
    await expect(parent).toBeVisible();
    await expect(child).toBeHidden();
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
