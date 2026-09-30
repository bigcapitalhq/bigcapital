import { test, expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createCustomerViaApi, createItemViaApi, readApiAuth } from './_api';
import {
  createCreditNote,
  deleteCreditNoteViaRow,
  filterCreditNotesByNumber,
  waitForCreditNoteForm,
  waitForCreditNotesList,
} from './_creditNotes';

const API_BASE = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:3000';

// Unique name so the credit note form's item picker resolves a single item.
const ITEM_NAME = `E2E CN Item ${faker.string.alphanumeric(6)}`;

/**
 * Generates a unique customer display name per test. The customer is seeded
 * through the API so the credit note form can select it.
 */
function generateCustomerName() {
  return `E2E CN Customer ${faker.string.alphanumeric(6)}`;
}

/**
 * Seeds a fresh customer for one test and returns its display name.
 */
async function seedCustomer() {
  const auth = readApiAuth();
  const displayName = generateCustomerName();
  await createCustomerViaApi(API_BASE, auth, { displayName });
  return displayName;
}

/**
 * Opens the edit form of the given credit note row through the context menu.
 */
async function openEditCreditNoteForm(page: Page, creditNoteNumber: string) {
  const row = await filterCreditNotesByNumber(page, creditNoteNumber);
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Edit Credit Note' }).click();
  await waitForCreditNoteForm(page, 'Edit Credit Note');
}

test.describe('credit notes', () => {
  test.beforeAll(async () => {
    const auth = readApiAuth();

    // Seeds the item that the credit note forms select in the UI.
    await createItemViaApi(API_BASE, auth, {
      name: ITEM_NAME,
      type: 'service',
    });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/credit-notes');
  });

  test('should show the credit notes page.', async ({ page }) => {
    await waitForCreditNotesList(page);

    await expect(
      page.getByRole('button', { name: 'New Credit Note' }).first(),
    ).toBeVisible();
  });

  test('should validate the required fields of the new credit note form.', async ({
    page,
  }) => {
    await waitForCreditNotesList(page);

    await page
      .getByRole('button', { name: 'New Credit Note' })
      .first()
      .click();
    await waitForCreditNoteForm(page, 'New Credit Note');

    await page.getByRole('button', { name: 'Save as Draft' }).click();

    await expect(
      page.getByText('Customer name is a required field'),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('should create a credit note successfully.', async ({ page }) => {
    await waitForCreditNotesList(page);

    const displayName = await seedCustomer();
    const creditNoteNumber = await createCreditNote(page, {
      customerName: displayName,
      itemName: ITEM_NAME,
    });

    const row = await filterCreditNotesByNumber(page, creditNoteNumber);
    await expect(row).toContainText(displayName, { timeout: 15_000 });
  });

  test('should edit a credit note successfully.', async ({ page }) => {
    await waitForCreditNotesList(page);

    const displayName = await seedCustomer();
    const creditNoteNumber = await createCreditNote(page, {
      customerName: displayName,
      itemName: ITEM_NAME,
    });
    const newReference = `REF-${faker.string.alphanumeric(8).toUpperCase()}`;

    await openEditCreditNoteForm(page, creditNoteNumber);
    await expect(
      page.getByTestId('credit-note-customer-select'),
    ).toContainText(displayName, { timeout: 30_000 });

    await page
      .getByTestId('credit-note-reference-input')
      .fill(newReference);
    await page.getByRole('button', { name: 'Save as Draft' }).click();

    await waitForCreditNotesList(page);

    const editedRow = await filterCreditNotesByNumber(page, creditNoteNumber);
    await expect(editedRow).toContainText(newReference, { timeout: 15_000 });
  });

  test('should delete a credit note successfully.', async ({ page }) => {
    await waitForCreditNotesList(page);

    const displayName = await seedCustomer();
    const creditNoteNumber = await createCreditNote(page, {
      customerName: displayName,
      itemName: ITEM_NAME,
    });

    const row = await filterCreditNotesByNumber(page, creditNoteNumber);
    await deleteCreditNoteViaRow(page, row);

    await expect(page.getByTestId('credit-note-row')).toHaveCount(0, {
      timeout: 15_000,
    });
  });
});
