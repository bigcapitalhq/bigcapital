import { test, expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createCustomerViaApi, createItemViaApi, readApiAuth } from './_api';
import {
  createInvoice,
  deleteInvoiceViaRow,
  filterInvoicesByNumber,
  waitForInvoiceForm,
  waitForInvoicesList,
} from './_invoices';

const API_BASE = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:3000';

// Unique name so the invoice form's item picker resolves a single item.
const ITEM_NAME = `E2E Inv Item ${faker.string.alphanumeric(6)}`;

/**
 * Generates a unique customer display name per test. The customer is seeded
 * through the API so the invoice form can select it.
 */
function generateCustomerName() {
  return `E2E Inv Customer ${faker.string.alphanumeric(6)}`;
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
 * Opens the edit form of the given invoice row through the context menu.
 */
async function openEditInvoiceForm(page: Page, invoiceNumber: string) {
  const row = await filterInvoicesByNumber(page, invoiceNumber);
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Edit Invoice' }).click();
  await waitForInvoiceForm(page, 'Edit Invoice');
}

/**
 * Asserts the invoice form opened in edit mode on a duplicate of the given
 * invoice: a different invoice, for the same customer.
 */
async function expectDuplicateOpened(
  page: Page,
  sourceInvoiceNumber: string,
  customerName: string,
) {
  await page.waitForURL(/\/invoices\/\d+\/edit$/, { timeout: 30_000 });
  await waitForInvoiceForm(page, 'Edit Invoice');
  await expect(page.getByTestId('invoice-customer-select')).toContainText(
    customerName,
    { timeout: 30_000 },
  );
  await expect(page.getByTestId('invoice-number-input')).not.toHaveValue(
    sourceInvoiceNumber,
  );
}

test.describe('invoices', () => {
  test.beforeAll(async () => {
    const auth = readApiAuth();

    // Seeds the item that the invoice forms select in the UI.
    await createItemViaApi(API_BASE, auth, {
      name: ITEM_NAME,
      type: 'service',
    });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/invoices');
  });

  test('should show the invoices page.', async ({ page }) => {
    await waitForInvoicesList(page);

    await expect(
      page.getByRole('button', { name: 'New Invoice' }).first(),
    ).toBeVisible();
  });

  test('should validate the required fields of the new invoice form.', async ({
    page,
  }) => {
    await waitForInvoicesList(page);

    await page.getByRole('button', { name: 'New Invoice' }).first().click();
    await waitForInvoiceForm(page, 'New Invoice');

    await page.getByRole('button', { name: 'Save as Draft' }).click();

    await expect(
      page.getByText('Customer name is a required field'),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('should create an invoice successfully.', async ({ page }) => {
    await waitForInvoicesList(page);

    const displayName = await seedCustomer();
    const invoiceNumber = await createInvoice(page, {
      customerName: displayName,
      itemName: ITEM_NAME,
    });

    const row = await filterInvoicesByNumber(page, invoiceNumber);
    await expect(row).toContainText(displayName, { timeout: 15_000 });
  });

  test('should edit an invoice successfully.', async ({ page }) => {
    await waitForInvoicesList(page);

    const displayName = await seedCustomer();
    const invoiceNumber = await createInvoice(page, {
      customerName: displayName,
      itemName: ITEM_NAME,
    });
    const newReference = `REF-${faker.string.alphanumeric(8).toUpperCase()}`;

    await openEditInvoiceForm(page, invoiceNumber);
    await expect(page.getByTestId('invoice-customer-select')).toContainText(
      displayName,
      { timeout: 30_000 },
    );

    await page.getByTestId('invoice-reference-input').fill(newReference);
    await page.getByRole('button', { name: 'Save as Draft' }).click();

    await waitForInvoicesList(page);

    const editedRow = await filterInvoicesByNumber(page, invoiceNumber);
    await expect(editedRow).toContainText(newReference, { timeout: 15_000 });
  });

  test('should delete an invoice successfully.', async ({ page }) => {
    await waitForInvoicesList(page);

    const displayName = await seedCustomer();
    const invoiceNumber = await createInvoice(page, {
      customerName: displayName,
      itemName: ITEM_NAME,
    });

    const row = await filterInvoicesByNumber(page, invoiceNumber);
    await deleteInvoiceViaRow(page, row);

    await expect(page.getByTestId('invoice-row')).toHaveCount(0, {
      timeout: 15_000,
    });
  });

  test('should duplicate an invoice from the selected row.', async ({
    page,
  }) => {
    await waitForInvoicesList(page);

    const displayName = await seedCustomer();
    const invoiceNumber = await createInvoice(page, {
      customerName: displayName,
      itemName: ITEM_NAME,
    });

    const row = await filterInvoicesByNumber(page, invoiceNumber);
    await row.locator('input[type="checkbox"]').check({ force: true });
    await page.getByRole('button', { name: 'Duplicate' }).click();

    await expectDuplicateOpened(page, invoiceNumber, displayName);
  });

  test('should duplicate an invoice from the invoice details drawer.', async ({
    page,
  }) => {
    await waitForInvoicesList(page);

    const displayName = await seedCustomer();
    const invoiceNumber = await createInvoice(page, {
      customerName: displayName,
      itemName: ITEM_NAME,
    });

    const row = await filterInvoicesByNumber(page, invoiceNumber);
    await row.click();
    await page
      .locator('.bp4-drawer')
      .getByRole('button', { name: 'Duplicate' })
      .click();

    await expectDuplicateOpened(page, invoiceNumber, displayName);
    await expect(page.locator('.bp4-drawer')).toHaveCount(0);
  });

  test('should duplicate a saved invoice from its edit form.', async ({
    page,
  }) => {
    await waitForInvoicesList(page);

    const displayName = await seedCustomer();
    const invoiceNumber = await createInvoice(page, {
      customerName: displayName,
      itemName: ITEM_NAME,
    });

    await openEditInvoiceForm(page, invoiceNumber);
    const sourceUrl = page.url();
    const duplicateButton = page.getByRole('button', { name: 'Duplicate' });

    // The duplicate is made from the saved invoice, so unsaved changes
    // disable the action until they are saved or reset.
    await expect(duplicateButton).toBeEnabled({ timeout: 30_000 });
    await page.getByTestId('invoice-reference-input').fill('UNSAVED-CHANGE');
    await expect(duplicateButton).toBeDisabled();
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(duplicateButton).toBeEnabled();

    await duplicateButton.click();

    await expectDuplicateOpened(page, invoiceNumber, displayName);
    expect(page.url()).not.toEqual(sourceUrl);
  });
});
