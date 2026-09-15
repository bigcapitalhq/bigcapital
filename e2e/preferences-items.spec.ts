import { test, expect } from '@playwright/test';
import {
  waitForPreferencesPage,
  selectAccountFromDropdown,
  savePreferences,
} from './_preferences';

const ITEMS_SUCCESS_MESSAGE = 'The items preferences has been saved.';

test.describe('preferences items', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preferences/items');
  });

  test('should show the items preferences page.', async ({ page }) => {
    await waitForPreferencesPage(page, 'Items');

    await expect(
      page.getByTestId('preferences-item-sell-account-select'),
    ).toBeVisible();
    await expect(
      page.getByTestId('preferences-item-cost-account-select'),
    ).toBeVisible();
    await expect(
      page.getByTestId('preferences-item-inventory-account-select'),
    ).toBeVisible();
  });

  test('should save the items preferences successfully.', async ({ page }) => {
    await waitForPreferencesPage(page, 'Items');

    await selectAccountFromDropdown(
      page,
      'preferences-item-sell-account-select',
      'Sales of Service Income',
    );
    await selectAccountFromDropdown(
      page,
      'preferences-item-cost-account-select',
      'Rent',
    );
    await selectAccountFromDropdown(
      page,
      'preferences-item-inventory-account-select',
      'Inventory Asset',
    );

    await savePreferences(page, ITEMS_SUCCESS_MESSAGE);
  });

  test('should save the items preferences without any account.', async ({
    page,
  }) => {
    await waitForPreferencesPage(page, 'Items');

    await savePreferences(page, ITEMS_SUCCESS_MESSAGE);
  });
});
