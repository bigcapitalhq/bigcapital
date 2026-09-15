import { test, expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createItemViaApi, createVendorViaApi, readApiAuth } from './_api';
import {
  createBill,
  deleteBillViaRow,
  filterBillsByNumber,
  waitForBillForm,
  waitForBillsList,
} from './_bills';

const API_BASE = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:3000';

// Unique name so the bill form's item picker resolves a single item.
const ITEM_NAME = `E2E Bill Item ${faker.string.alphanumeric(6)}`;

/**
 * Generates a unique vendor display name per test. The vendor is seeded
 * through the API so the bill form can select it.
 */
function generateVendorName() {
  return `E2E Bill Vendor ${faker.string.alphanumeric(6)}`;
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
 * Opens the edit form of the given bill row through the context menu.
 */
async function openEditBillForm(page: Page, billNumber: string) {
  const row = await filterBillsByNumber(page, billNumber);
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Edit Bill' }).click();
  await waitForBillForm(page, 'Edit Bill');
}

test.describe('bills', () => {
  test.beforeAll(async () => {
    const auth = readApiAuth();

    // Seeds the item that the bill forms select in the UI.
    await createItemViaApi(API_BASE, auth, {
      name: ITEM_NAME,
      type: 'service',
    });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/bills');
  });

  test('should show the bills page.', async ({ page }) => {
    await waitForBillsList(page);

    await expect(
      page.getByRole('button', { name: 'New Bill' }).first(),
    ).toBeVisible();
  });

  test('should validate the required fields of the new bill form.', async ({
    page,
  }) => {
    await waitForBillsList(page);

    await page.getByRole('button', { name: 'New Bill' }).first().click();
    await waitForBillForm(page, 'New Bill');

    await page.getByRole('button', { name: 'Save as Draft' }).click();

    await expect(
      page.getByText('Vendor name is a required field'),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('should create a bill successfully.', async ({ page }) => {
    await waitForBillsList(page);

    const displayName = await seedVendor();
    const billNumber = await createBill(page, {
      vendorName: displayName,
      itemName: ITEM_NAME,
    });

    const row = await filterBillsByNumber(page, billNumber);
    await expect(row).toContainText(displayName, { timeout: 15_000 });
  });

  test('should edit a bill successfully.', async ({ page }) => {
    await waitForBillsList(page);

    const displayName = await seedVendor();
    const billNumber = await createBill(page, {
      vendorName: displayName,
      itemName: ITEM_NAME,
    });
    const newReference = `REF-${faker.string.alphanumeric(8).toUpperCase()}`;

    await openEditBillForm(page, billNumber);
    await expect(page.getByTestId('bill-vendor-select')).toContainText(
      displayName,
      { timeout: 30_000 },
    );

    await page.getByTestId('bill-reference-input').fill(newReference);
    await page.getByRole('button', { name: 'Save as Draft' }).click();

    await waitForBillsList(page);

    const editedRow = await filterBillsByNumber(page, billNumber);
    await expect(editedRow).toContainText(newReference, { timeout: 15_000 });
  });

  test('should delete a bill successfully.', async ({ page }) => {
    await waitForBillsList(page);

    const displayName = await seedVendor();
    const billNumber = await createBill(page, {
      vendorName: displayName,
      itemName: ITEM_NAME,
    });

    const row = await filterBillsByNumber(page, billNumber);
    await deleteBillViaRow(page, row);

    await expect(page.getByTestId('bill-row')).toHaveCount(0, {
      timeout: 15_000,
    });
  });
});
