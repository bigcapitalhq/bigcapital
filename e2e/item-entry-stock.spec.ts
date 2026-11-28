import { expect, test } from '@playwright/test';
import {
  createItemViaApi,
  createQuickInventoryAdjustmentViaApi,
  findItemIdByName,
  readApiAuth,
} from './_api';
import { selectEntryItem } from './_invoices';

const apiBase = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:3000';
const inventoryItemName = `E2E stock inventory ${Date.now()}`;
const serviceItemName = `E2E stock service ${Date.now()}`;

// The stock tooltip formats quantities with the browser locale.
test.use({ locale: 'en-US' });

test.beforeAll(async () => {
  const auth = readApiAuth();
  const item = await createItemViaApi(apiBase, auth, {
    name: inventoryItemName,
    type: 'inventory',
    reorderPoint: 5,
  });
  await createQuickInventoryAdjustmentViaApi(apiBase, auth, {
    itemId:
      item?.id ?? (await findItemIdByName(apiBase, auth, inventoryItemName)),
    quantity: 1250,
  });
  await createItemViaApi(apiBase, auth, {
    name: serviceItemName,
    type: 'service',
  });
});

for (const form of ['invoices', 'bills']) {
  test(`shows the stock of inventory items on ${form} lines`, async ({
    page,
  }) => {
    await page.goto(`/${form}/new`);
    await selectEntryItem(page, inventoryItemName);

    // Add a service line; service items have no stock to show.
    const secondItemInput = page.getByPlaceholder('Enter an item...').nth(1);
    await secondItemInput.click();
    await secondItemInput.pressSequentially(serviceItemName);
    await page.getByRole('menuitem', { name: serviceItemName }).first().click();

    const quantities = page.getByRole('spinbutton');
    await expect(quantities.nth(1)).toHaveValue('1');
    await page.keyboard.press('Escape');

    const tooltip = page.getByTestId('item-stock-tooltip');
    await expect(tooltip).toBeHidden();

    // Focusing the inventory line quantity shows its stock.
    await quantities.first().click();
    await expect(tooltip.locator('dt')).toHaveText([
      'Qty on hand:',
      'Reorder point:',
    ]);
    await expect(tooltip.locator('dd')).toHaveText(['1,250', '5']);

    // Moving to the service line quantity hides it.
    await quantities.nth(1).click();
    await expect(tooltip).toBeHidden();
  });
}
