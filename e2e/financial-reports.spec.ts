import { test, expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import {
  createCustomerViaApi,
  createDeliveredInvoiceViaApi,
  createExpenseViaApi,
  createItemViaApi,
  createOpenedBillViaApi,
  createTaxRateViaApi,
  createVendorViaApi,
  findCustomerIdByName,
  findItemIdByName,
  findVendorIdByName,
  readApiAuth,
} from './_api';

const API_BASE = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:3000';

// Unique names so reseeding within a run never collides with existing rows.
const CUSTOMER_NAME = `E2E Customer ${faker.string.alphanumeric(6)}`;
const VENDOR_NAME = `E2E Vendor ${faker.string.alphanumeric(6)}`;
const ITEM_NAME = `E2E Item ${faker.string.alphanumeric(6)}`;
const TAX_RATE_NAME = `E2E VAT ${faker.string.alphanumeric(4)}`;
const TAX_RATE_CODE = `VAT-${faker.string.alphanumeric(4)}`;

/**
 * Waits until the report page is loaded (topbar title).
 */
async function waitForReportPage(page: Page, title: string) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    title,
    { timeout: 30_000 },
  );
}

/**
 * Waits until the report table renders at least one data row.
 */
async function waitForReportRows(page: Page, prefix: string) {
  await expect(
    page.getByTestId(new RegExp(`^${prefix}-row--`)).first(),
  ).toBeVisible({ timeout: 30_000 });
}

test.describe('financial reports', () => {
  test.beforeAll(async () => {
    const auth = readApiAuth();

    // Seeds a "kitchen-sink" dataset so every report category renders rows:
    // an expense (ledger + audit log), a customer/vendor pair, an inventory
    // item, a non-zero tax rate, an opened bill (purchase + inventory IN lot)
    // and a delivered invoice (sale + inventory OUT lot + tax payable).

    await createExpenseViaApi(API_BASE, auth, {
      referenceNo: `RPT-${faker.string.alphanumeric(6).toUpperCase()}`,
      amount: faker.number.int({ min: 1000, max: 50000 }),
    });

    const customerResult = await createCustomerViaApi(API_BASE, auth, {
      displayName: CUSTOMER_NAME,
    });
    const vendorResult = await createVendorViaApi(API_BASE, auth, {
      displayName: VENDOR_NAME,
    });

    // An inventory item drives the sales/purchases-by-items + inventory
    // valuation/item-details reports (they only count inventory transactions).
    const itemResult = await createItemViaApi(API_BASE, auth, {
      name: ITEM_NAME,
      type: 'inventory',
    });
    const itemId =
      itemResult?.id ?? (await findItemIdByName(API_BASE, auth, ITEM_NAME));
    const taxRate = await createTaxRateViaApi(API_BASE, auth, {
      name: TAX_RATE_NAME,
      code: TAX_RATE_CODE,
      rate: 10,
    });

    const customerId =
      customerResult?.id ??
      (await findCustomerIdByName(API_BASE, auth, CUSTOMER_NAME));
    const vendorId =
      vendorResult?.id ??
      (await findVendorIdByName(API_BASE, auth, VENDOR_NAME));

    // Purchase first so the inventory IN lot precedes the sale OUT lot.
    await createOpenedBillViaApi(API_BASE, auth, {
      vendorId,
      itemId,
      rate: 40,
      quantity: 5,
    });
    await createDeliveredInvoiceViaApi(API_BASE, auth, {
      customerId,
      itemId,
      rate: 100,
      quantity: 2,
      taxRateId: taxRate?.id,
    });
  });

  test('should render the Trial Balance Sheet report.', async ({ page }) => {
    await page.goto('/financial-reports/trial-balance-sheet');
    await waitForReportPage(page, 'Trial Balance Sheet');
    await waitForReportRows(page, 'trial-balance');
  });

  test('should render the General Ledger report.', async ({ page }) => {
    await page.goto('/financial-reports/general-ledger');
    await waitForReportPage(page, 'General Ledger');
    await waitForReportRows(page, 'general-ledger');
  });

  test('should render the Profit/Loss Sheet report.', async ({ page }) => {
    await page.goto('/financial-reports/profit-loss-sheet');
    await waitForReportPage(page, 'Profit/Loss Sheet');
    await waitForReportRows(page, 'profit-loss');
  });

  test('should render the Journal Sheet report.', async ({ page }) => {
    await page.goto('/financial-reports/journal-sheet');
    await waitForReportPage(page, 'Journal Sheet');
    await waitForReportRows(page, 'journal');
  });

  test('should render the Cash Flow Statement report.', async ({ page }) => {
    await page.goto('/financial-reports/cash-flow');
    await waitForReportPage(page, 'Cash Flow Statement');
    await waitForReportRows(page, 'cash-flow');
  });

  test('should render the Receivable Aging Summary report.', async ({
    page,
  }) => {
    await page.goto('/financial-reports/receivable-aging-summary');
    await waitForReportPage(page, 'Receivable Aging Summary');
    await waitForReportRows(page, 'ar-aging');
  });

  test('should render the Payable Aging Summary report.', async ({ page }) => {
    await page.goto('/financial-reports/payable-aging-summary');
    await waitForReportPage(page, 'Payable Aging Summary');
    await waitForReportRows(page, 'ap-aging');
  });

  test('should render the Customers Balance Summary report.', async ({
    page,
  }) => {
    await page.goto('/financial-reports/customers-balance-summary');
    await waitForReportPage(page, 'Customers Balance Summary');
    await waitForReportRows(page, 'customers-balance');
  });

  test('should render the Vendors Balance Summary report.', async ({
    page,
  }) => {
    await page.goto('/financial-reports/vendors-balance-summary');
    await waitForReportPage(page, 'Vendors Balance Summary');
    await waitForReportRows(page, 'vendors-balance');
  });

  test('should render the Customers Transactions report.', async ({ page }) => {
    await page.goto('/financial-reports/transactions-by-customers');
    await waitForReportPage(page, 'Customers Transactions');
    await waitForReportRows(page, 'customers-transactions');
  });

  test('should render the Vendors Transactions report.', async ({ page }) => {
    await page.goto('/financial-reports/transactions-by-vendors');
    await waitForReportPage(page, 'Vendors Transactions');
    await waitForReportRows(page, 'vendors-transactions');
  });

  test('should render the Sales by items report.', async ({ page }) => {
    await page.goto('/financial-reports/sales-by-items');
    await waitForReportPage(page, 'Sales by items');
    await waitForReportRows(page, 'sales-by-items');
  });

  test('should render the Purchases by items report.', async ({ page }) => {
    await page.goto('/financial-reports/purchases-by-items');
    await waitForReportPage(page, 'Purchases by items');
    await waitForReportRows(page, 'purchases-by-items');
  });

  test('should render the Inventory valuation report.', async ({ page }) => {
    await page.goto('/financial-reports/inventory-valuation');
    await waitForReportPage(page, 'Inventory valuation');
    await waitForReportRows(page, 'inventory-valuation');
  });

  test('should render the Inventory Item Details report.', async ({ page }) => {
    await page.goto('/financial-reports/inventory-item-details');
    await waitForReportPage(page, 'Inventory Item Details');
    await waitForReportRows(page, 'inventory-item-details');
  });

  test('should render the Sales Tax Liability Summary report.', async ({
    page,
  }) => {
    await page.goto('/financial-reports/sales-tax-liability-summary');
    await waitForReportPage(page, 'Sales Tax Liability Summary');
    await waitForReportRows(page, 'sales-tax-liability');
  });

  test('should render the Realized Gain or Loss report page.', async ({
    page,
  }) => {
    await page.goto('/financial-reports/realized-gain-loss');
    await waitForReportPage(page, 'Realized Gain or Loss');
    await expect(
      page.getByRole('button', { name: 'Customize Report' }),
    ).toBeVisible();
  });

  test('should render the Unrealized Gain or Loss report page.', async ({
    page,
  }) => {
    await page.goto('/financial-reports/unrealized-gain-loss');
    await waitForReportPage(page, 'Unrealized Gain or Loss');
    await expect(
      page.getByRole('button', { name: 'Customize Report' }),
    ).toBeVisible();
  });

  test('should render the Audit Log report.', async ({ page }) => {
    await page.goto('/financial-reports/audit-log');
    await waitForReportPage(page, 'Audit Log');
    await expect(page.getByTestId('audit-log-row').first()).toBeVisible({
      timeout: 30_000,
    });
  });
});
