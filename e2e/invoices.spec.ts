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
    const id = await row.getAttribute('data-invoice-id');
    await expect(
      page
        .locator(`[data-invoice-id="${id}"]`)
        .getByText(displayName, { exact: true }),
    ).toBeVisible({ timeout: 15_000 });
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
    const id = await editedRow.getAttribute('data-invoice-id');
    await expect(
      page
        .locator(`[data-invoice-id="${id}"]`)
        .getByText(newReference, { exact: true }),
    ).toBeVisible({ timeout: 15_000 });
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

  test('keeps bulk selection tied to invoice IDs across server pages and sorting', async ({
    page,
  }) => {
    const invoices = Array.from({ length: 21 }, (_, index) => ({
      id: 101 + index,
      invoice_no: `PAGE-${String(index + 1).padStart(2, '0')}`,
      due_date: '2025-08-01',
    }));
    await page.route(
      (url) => url.pathname === '/api/sale-invoices',
      (route) => {
        const query = new URL(route.request().url()).searchParams;
        const size = Number(query.get('page_size'));
        const start = (Number(query.get('page')) - 1) * size;
        const rows =
          query.get('column_sort_by') === 'invoice_no' &&
          query.get('sort_order') === 'desc'
            ? [...invoices].reverse()
            : invoices;
        return route.fulfill({
          json: {
            data: rows.slice(start, start + size),
            pagination: { total: invoices.length },
          },
        });
      },
    );
    await page.route('**/api/sale-invoices/validate-bulk-delete', (route) =>
      route.fulfill({ json: { deletable_count: 2, non_deletable_count: 0 } }),
    );
    await page.reload();

    const firstInvoice = page.getByTestId('invoice-row').first();
    const firstCheckbox = page.getByRole('checkbox', {
      name: 'Select row 1',
      exact: true,
    });
    await expect(firstInvoice).toHaveText('PAGE-01');
    await firstCheckbox.press('Space');
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(firstInvoice).toHaveText('PAGE-21');
    await expect(firstCheckbox).not.toBeChecked();
    await firstCheckbox.press('Space');

    const [validation] = await Promise.all([
      page.waitForRequest('**/api/sale-invoices/validate-bulk-delete'),
      page.getByRole('button', { name: 'Delete', exact: true }).click(),
    ]);
    expect(validation.postDataJSON().ids).toEqual([101, 121]);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();

    await page
      .getByRole('combobox', { name: 'Rows per page' })
      .selectOption('30');
    await expect(firstInvoice).toHaveText('PAGE-01');
    await expect(firstCheckbox).toBeChecked();
    await expect(
      page.getByRole('button', { name: 'Next page' }),
    ).toBeDisabled();

    const invoiceNumberHeader = page.getByTitle('Invoice No', { exact: true });
    await invoiceNumberHeader.hover();
    await invoiceNumberHeader.locator('[data-icon="chevron-down"]').click();
    await page.getByRole('menuitem', { name: 'Sort Desc' }).click();
    await expect(firstInvoice).toHaveText('PAGE-21');
    await expect(firstCheckbox).toBeChecked();
  });
});
