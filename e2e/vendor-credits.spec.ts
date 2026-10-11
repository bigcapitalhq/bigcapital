import { test, expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createItemViaApi, createVendorViaApi, readApiAuth } from './_api';
import {
  createVendorCredit,
  deleteVendorCreditViaRow,
  filterVendorCreditsByNumber,
  waitForVendorCreditForm,
  waitForVendorCreditsList,
} from './_vendorCredits';

const API_BASE = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:3000';

// Unique name so the vendor credit form's item picker resolves a single item.
const ITEM_NAME = `E2E VC Item ${faker.string.alphanumeric(6)}`;

/**
 * Generates a unique vendor display name per test. The vendor is seeded
 * through the API so the vendor credit form can select it.
 */
function generateVendorName() {
  return `E2E VC Vendor ${faker.string.alphanumeric(6)}`;
}

/**
 * Seeds a fresh vendor for one test and returns its display name.
 */
async function seedVendor() {
  const auth = readApiAuth();
  const displayName = generateVendorName();
  await createVendorViaApi(API_BASE, auth, { displayName });
  return displayName;
}

/**
 * Opens the edit form of the given vendor credit row through the context menu.
 */
async function openEditVendorCreditForm(page: Page, vendorCreditNumber: string) {
  const row = await filterVendorCreditsByNumber(page, vendorCreditNumber);
  await row.click({ button: 'right' });
  await page
    .getByRole('menuitem', { name: 'Edit Vendor Credit' })
    .click();
  await waitForVendorCreditForm(page, 'Edit Vendor Credit');
}

test.describe('vendor credits', () => {
  test.beforeAll(async () => {
    const auth = readApiAuth();

    // Seeds the item that the vendor credit forms select in the UI.
    await createItemViaApi(API_BASE, auth, {
      name: ITEM_NAME,
      type: 'service',
    });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/vendor-credits');
  });

  test('should show the vendor credits page.', async ({ page }) => {
    await waitForVendorCreditsList(page);

    await expect(
      page.getByRole('button', { name: 'New Vendor Credit' }).first(),
    ).toBeVisible();
  });

  test('should validate the required fields of the new vendor credit form.', async ({
    page,
  }) => {
    await waitForVendorCreditsList(page);

    await page
      .getByRole('button', { name: 'New Vendor Credit' })
      .first()
      .click();
    await waitForVendorCreditForm(page, 'New Vendor Credit');

    await page.getByRole('button', { name: 'Save as Draft' }).click();

    await expect(
      page.getByText('Vendor name is a required field'),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('should create a vendor credit successfully.', async ({ page }) => {
    await waitForVendorCreditsList(page);

    const displayName = await seedVendor();
    const vendorCreditNumber = await createVendorCredit(page, {
      vendorName: displayName,
      itemName: ITEM_NAME,
    });

    const row = await filterVendorCreditsByNumber(page, vendorCreditNumber);
    await expect(row).toContainText(displayName, { timeout: 15_000 });
  });

  test('should edit a vendor credit successfully.', async ({ page }) => {
    await waitForVendorCreditsList(page);

    const displayName = await seedVendor();
    const vendorCreditNumber = await createVendorCredit(page, {
      vendorName: displayName,
      itemName: ITEM_NAME,
    });
    const newReference = `REF-${faker.string.alphanumeric(8).toUpperCase()}`;

    await openEditVendorCreditForm(page, vendorCreditNumber);
    await expect(
      page.getByTestId('vendor-credit-vendor-select'),
    ).toContainText(displayName, { timeout: 30_000 });

    await page
      .getByTestId('vendor-credit-reference-input')
      .fill(newReference);
    await page.getByRole('button', { name: 'Save as Draft' }).click();

    await waitForVendorCreditsList(page);

    const editedRow = await filterVendorCreditsByNumber(
      page,
      vendorCreditNumber,
    );
    await expect(editedRow).toContainText(newReference, { timeout: 15_000 });
  });

  test('should delete a vendor credit successfully.', async ({ page }) => {
    await waitForVendorCreditsList(page);

    const displayName = await seedVendor();
    const vendorCreditNumber = await createVendorCredit(page, {
      vendorName: displayName,
      itemName: ITEM_NAME,
    });

    const row = await filterVendorCreditsByNumber(page, vendorCreditNumber);
    await deleteVendorCreditViaRow(page, row);

    await expect(page.getByTestId('vendor-credit-row')).toHaveCount(0, {
      timeout: 15_000,
    });
  });
});
