import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { waitForPreferencesPage, savePreferences } from './_preferences';

const SUCCESS_MESSAGE = 'The preferences have been saved successfully.';

const receiptMessage = () => faker.lorem.sentence();
const termsConditions = () => faker.lorem.sentence();

test.describe('preferences receipts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preferences/receipts');
  });

  test('should show the receipts preferences page.', async ({ page }) => {
    await waitForPreferencesPage(page, 'Receipts');

    await expect(
      page.getByTestId('preferences-receipts-message'),
    ).toBeVisible();
    await expect(
      page.getByTestId('preferences-receipts-terms-conditions'),
    ).toBeVisible();
  });

  test('should save the receipts preferences successfully.', async ({
    page,
  }) => {
    await waitForPreferencesPage(page, 'Receipts');

    const message = receiptMessage();
    const terms = termsConditions();

    await page.getByTestId('preferences-receipts-message').fill(message);
    await page
      .getByTestId('preferences-receipts-terms-conditions')
      .fill(terms);

    await savePreferences(page, SUCCESS_MESSAGE);
  });

  test('should prefill the saved receipts preferences on reload.', async ({
    page,
  }) => {
    await waitForPreferencesPage(page, 'Receipts');

    const message = receiptMessage();
    const terms = termsConditions();

    await page.getByTestId('preferences-receipts-message').fill(message);
    await page
      .getByTestId('preferences-receipts-terms-conditions')
      .fill(terms);

    await savePreferences(page, SUCCESS_MESSAGE);

    await page.reload();
    await waitForPreferencesPage(page, 'Receipts');

    await expect(page.getByTestId('preferences-receipts-message')).toHaveValue(
      message,
      { timeout: 15_000 },
    );
    await expect(
      page.getByTestId('preferences-receipts-terms-conditions'),
    ).toHaveValue(terms);
  });
});
