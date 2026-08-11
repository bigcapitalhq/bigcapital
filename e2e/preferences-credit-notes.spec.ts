import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { waitForPreferencesPage, savePreferences } from './_preferences';

const SUCCESS_MESSAGE = 'The preferences have been saved successfully.';

const customerNotes = () => faker.lorem.sentence();
const termsConditions = () => faker.lorem.sentence();

test.describe('preferences credit notes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preferences/credit-notes');
  });

  test('should show the credit notes preferences page.', async ({ page }) => {
    await waitForPreferencesPage(page, 'Credit Notes');

    await expect(
      page.getByTestId('preferences-credit-notes-customer-notes'),
    ).toBeVisible();
    await expect(
      page.getByTestId('preferences-credit-notes-terms-conditions'),
    ).toBeVisible();
  });

  test('should save the credit notes preferences successfully.', async ({
    page,
  }) => {
    await waitForPreferencesPage(page, 'Credit Notes');

    const notes = customerNotes();
    const terms = termsConditions();

    await page
      .getByTestId('preferences-credit-notes-customer-notes')
      .fill(notes);
    await page
      .getByTestId('preferences-credit-notes-terms-conditions')
      .fill(terms);

    await savePreferences(page, SUCCESS_MESSAGE);
  });

  test('should prefill the saved credit notes preferences on reload.', async ({
    page,
  }) => {
    await waitForPreferencesPage(page, 'Credit Notes');

    const notes = customerNotes();
    const terms = termsConditions();

    await page
      .getByTestId('preferences-credit-notes-customer-notes')
      .fill(notes);
    await page
      .getByTestId('preferences-credit-notes-terms-conditions')
      .fill(terms);

    await savePreferences(page, SUCCESS_MESSAGE);

    await page.reload();
    await waitForPreferencesPage(page, 'Credit Notes');

    await expect(
      page.getByTestId('preferences-credit-notes-customer-notes'),
    ).toHaveValue(notes, { timeout: 15_000 });
    await expect(
      page.getByTestId('preferences-credit-notes-terms-conditions'),
    ).toHaveValue(terms);
  });
});
