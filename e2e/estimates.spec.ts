import { test, expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createCustomerViaApi, createItemViaApi, readApiAuth } from './_api';
import {
  createEstimate,
  deleteEstimateViaRow,
  filterEstimatesByNumber,
  waitForEstimateForm,
  waitForEstimatesList,
} from './_estimates';

const API_BASE = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:3000';

// Unique name so the estimate form's item picker resolves a single item.
const ITEM_NAME = `E2E Est Item ${faker.string.alphanumeric(6)}`;

/**
 * Generates a unique customer display name per test. The customer is seeded
 * through the API so the estimate form can select it.
 */
function generateCustomerName() {
  return `E2E Est Customer ${faker.string.alphanumeric(6)}`;
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
 * Opens the edit form of the given estimate row through the context menu.
 */
async function openEditEstimateForm(page: Page, estimateNumber: string) {
  const row = await filterEstimatesByNumber(page, estimateNumber);
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Edit Estimate' }).click();
  await waitForEstimateForm(page, 'Edit Estimate');
}

test.describe('estimates', () => {
  test.beforeAll(async () => {
    const auth = readApiAuth();

    // Seeds the item that the estimate forms select in the UI.
    await createItemViaApi(API_BASE, auth, {
      name: ITEM_NAME,
      type: 'service',
    });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/estimates');
  });

  test('should show the estimates page.', async ({ page }) => {
    await waitForEstimatesList(page);

    await expect(
      page.getByRole('button', { name: 'New Estimate' }).first(),
    ).toBeVisible();
  });

  test('should validate the required fields of the new estimate form.', async ({
    page,
  }) => {
    await waitForEstimatesList(page);

    await page.getByRole('button', { name: 'New Estimate' }).first().click();
    await waitForEstimateForm(page, 'New Estimate');

    await page.getByRole('button', { name: 'Save as Draft' }).click();

    await expect(
      page.getByText('Customer name is a required field'),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('should create an estimate successfully.', async ({ page }) => {
    await waitForEstimatesList(page);

    const displayName = await seedCustomer();
    const estimateNumber = await createEstimate(page, {
      customerName: displayName,
      itemName: ITEM_NAME,
    });

    const row = await filterEstimatesByNumber(page, estimateNumber);
    await expect(row).toContainText(displayName, { timeout: 15_000 });
  });

  test('should edit an estimate successfully.', async ({ page }) => {
    await waitForEstimatesList(page);

    const displayName = await seedCustomer();
    const estimateNumber = await createEstimate(page, {
      customerName: displayName,
      itemName: ITEM_NAME,
    });
    const newReference = `REF-${faker.string.alphanumeric(8).toUpperCase()}`;

    await openEditEstimateForm(page, estimateNumber);
    await expect(page.getByTestId('estimate-customer-select')).toContainText(
      displayName,
      { timeout: 30_000 },
    );

    await page.getByTestId('estimate-reference-input').fill(newReference);
    await page.getByRole('button', { name: 'Save as Draft' }).click();

    await waitForEstimatesList(page);

    const editedRow = await filterEstimatesByNumber(page, estimateNumber);
    await expect(editedRow).toContainText(newReference, { timeout: 15_000 });
  });

  test('should delete an estimate successfully.', async ({ page }) => {
    await waitForEstimatesList(page);

    const displayName = await seedCustomer();
    const estimateNumber = await createEstimate(page, {
      customerName: displayName,
      itemName: ITEM_NAME,
    });

    const row = await filterEstimatesByNumber(page, estimateNumber);
    await deleteEstimateViaRow(page, row);

    await expect(page.getByTestId('estimate-row')).toHaveCount(0, {
      timeout: 15_000,
    });
  });
});
