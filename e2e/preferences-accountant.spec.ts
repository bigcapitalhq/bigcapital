import { test, expect } from '@playwright/test';
import {
  waitForPreferencesPage,
  selectAccountFromDropdown,
  savePreferences,
} from './_preferences';

const ACCOUNTANT_SUCCESS_MESSAGE =
  'The accountant preferences has been saved.';

test.describe('preferences accountant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preferences/accountant');
  });

  test('should show the accountant preferences page.', async ({ page }) => {
    await waitForPreferencesPage(page, 'Accountant');

    await expect(
      page.getByRole('radio', { name: 'Accrual' }),
    ).toBeVisible();
    await expect(
      page.getByTestId('preferences-accountant-deposit-account-select'),
    ).toBeVisible();
  });

  test('should save the accountant preferences successfully.', async ({
    page,
  }) => {
    await waitForPreferencesPage(page, 'Accountant');

    await page
      .getByRole('checkbox', {
        name: 'Make account code required when create a new account',
      })
      .check();
    await page.getByRole('radio', { name: 'Cash' }).check();

    await selectAccountFromDropdown(
      page,
      'preferences-accountant-deposit-account-select',
      'Petty Cash',
    );
    await selectAccountFromDropdown(
      page,
      'preferences-accountant-withdrawal-account-select',
      'Petty Cash',
    );
    await selectAccountFromDropdown(
      page,
      'preferences-accountant-advance-deposit-select',
      'Undeposited Funds',
    );

    await savePreferences(page, ACCOUNTANT_SUCCESS_MESSAGE);

    await expect(
      page.getByRole('checkbox', {
        name: 'Make account code required when create a new account',
      }),
    ).toBeChecked();
  });
});
