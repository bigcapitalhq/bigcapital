import { expect, test } from '@playwright/test';
import { createItemViaApi, readApiAuth } from './_api';
import { selectEntryItem } from './_invoices';

const apiBase = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:3000';
const itemName = `E2E line account ${Date.now()}`;

test.beforeAll(async () => {
  await createItemViaApi(apiBase, readApiAuth(), {
    name: itemName,
    type: 'service',
  });
});

for (const [form, account] of [
  ['invoices', 'Sales of Product Income'],
  ['bills', 'Cost of Goods Sold'],
]) {
  test(`selecting an item fills its account on ${form}`, async ({ page }) => {
    await page.goto(`/${form}/new`);
    await selectEntryItem(page, itemName);

    const accounts = page.locator('.form-group--account input');
    await expect(accounts.first()).toHaveValue(account);
    await expect(accounts.nth(1)).toHaveValue('');
  });
}
