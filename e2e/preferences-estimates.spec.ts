import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { waitForPreferencesPage, savePreferences } from './_preferences';

const SUCCESS_MESSAGE = 'The preferences have been saved successfully.';

const customerNotes = () => faker.lorem.sentence();
const termsConditions = () => faker.lorem.sentence();

test.describe('preferences estimates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preferences/estimates');
  });

  test('should show the estimates preferences page.', async ({ page }) => {
    await waitForPreferencesPage(page, 'Estimates');

    await expect(
      page.getByTestId('preferences-estimates-customer-notes'),
    ).toBeVisible();
    await expect(
      page.getByTestId('preferences-estimates-terms-conditions'),
    ).toBeVisible();
  });

  test('should save the estimates preferences successfully.', async ({
    page,
  }) => {
    await waitForPreferencesPage(page, 'Estimates');

    const notes = customerNotes();
    const terms = termsConditions();

    await page
      .getByTestId('preferences-estimates-customer-notes')
      .fill(notes);
    await page
      .getByTestId('preferences-estimates-terms-conditions')
      .fill(terms);

    await savePreferences(page, SUCCESS_MESSAGE);
  });

  test('should prefill the saved estimates preferences on reload.', async ({
    page,
  }) => {
    await waitForPreferencesPage(page, 'Estimates');

    const notes = customerNotes();
    const terms = termsConditions();

    await page
      .getByTestId('preferences-estimates-customer-notes')
      .fill(notes);
    await page
      .getByTestId('preferences-estimates-terms-conditions')
      .fill(terms);

    await savePreferences(page, SUCCESS_MESSAGE);

    await page.reload();
    await waitForPreferencesPage(page, 'Estimates');

    await expect(
      page.getByTestId('preferences-estimates-customer-notes'),
    ).toHaveValue(notes, { timeout: 15_000 });
    await expect(
      page.getByTestId('preferences-estimates-terms-conditions'),
    ).toHaveValue(terms);
  });
});
