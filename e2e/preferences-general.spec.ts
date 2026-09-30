import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import {
  waitForPreferencesPage,
  savePreferences,
} from './_preferences';

const GENERAL_SUCCESS_MESSAGE = 'The general preferences has been saved.';

const industry = () =>
  `${faker.company.buzzNoun()} ${faker.string.alphanumeric(4)}`;

test.describe('preferences general', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preferences/general');
  });

  test('should show the general preferences page.', async ({ page }) => {
    await waitForPreferencesPage(page, 'General');

    await expect(
      page.getByTestId('preferences-general-name-input'),
    ).toBeVisible();
    await expect(
      page.getByTestId('preferences-general-base-currency-select'),
    ).toBeVisible();
    await expect(
      page.getByTestId('preferences-general-date-format-select'),
    ).toBeVisible();
  });

  test('should save the general preferences successfully.', async ({
    page,
  }) => {
    await waitForPreferencesPage(page, 'General');

    const value = industry();
    await page.getByTestId('preferences-general-industry-input').fill(value);

    await savePreferences(page, GENERAL_SUCCESS_MESSAGE);

    await expect(
      page.getByTestId('preferences-general-industry-input'),
    ).toHaveValue(value);
  });

  test('should validate the required fields of the general preferences.', async ({
    page,
  }) => {
    await waitForPreferencesPage(page, 'General');

    await page.getByTestId('preferences-general-name-input').fill('');
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    await expect(
      page.getByText('Organization name is a required field'),
    ).toBeVisible({ timeout: 15_000 });
  });
});
