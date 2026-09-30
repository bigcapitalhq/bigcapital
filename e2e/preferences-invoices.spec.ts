import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { waitForPreferencesPage, savePreferences } from './_preferences';

const SUCCESS_MESSAGE = 'The preferences have been saved successfully.';

const customerNotes = () => faker.lorem.sentence();
const termsConditions = () => faker.lorem.sentence();

test.describe('preferences invoices', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preferences/invoices');
  });

  test('should show the invoices preferences page.', async ({ page }) => {
    await waitForPreferencesPage(page, 'Invoices');

    await expect(
      page.getByTestId('preferences-invoices-customer-notes'),
    ).toBeVisible();
    await expect(
      page.getByTestId('preferences-invoices-terms-conditions'),
    ).toBeVisible();
  });

  test('should save the invoices preferences successfully.', async ({
    page,
  }) => {
    await waitForPreferencesPage(page, 'Invoices');

    const notes = customerNotes();
    const terms = termsConditions();

    await page
      .getByTestId('preferences-invoices-customer-notes')
      .fill(notes);
    await page
      .getByTestId('preferences-invoices-terms-conditions')
      .fill(terms);

    await savePreferences(page, SUCCESS_MESSAGE);
  });

  test('should prefill the saved invoices preferences on reload.', async ({
    page,
  }) => {
    await waitForPreferencesPage(page, 'Invoices');

    const notes = customerNotes();
    const terms = termsConditions();

    await page
      .getByTestId('preferences-invoices-customer-notes')
      .fill(notes);
    await page
      .getByTestId('preferences-invoices-terms-conditions')
      .fill(terms);

    await savePreferences(page, SUCCESS_MESSAGE);

    await page.reload();
    await waitForPreferencesPage(page, 'Invoices');

    await expect(
      page.getByTestId('preferences-invoices-customer-notes'),
    ).toHaveValue(notes, { timeout: 15_000 });
    await expect(
      page.getByTestId('preferences-invoices-terms-conditions'),
    ).toHaveValue(terms);
  });
});
