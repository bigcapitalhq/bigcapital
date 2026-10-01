import { test, expect, type Locator, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import {
  createCustomerViaApi,
  createDeliveredInvoiceViaApi,
  createItemViaApi,
  findItemIdByName,
  readApiAuth,
} from './_api';
import {
  selectCustomer,
  selectEntryItem,
  waitForInvoiceForm,
  waitForInvoicesList,
} from './_invoices';

const API_BASE = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:3000';

// Unique name so the invoice form's item picker resolves a single item.
const ITEM_NAME = `E2E Date Item ${faker.string.alphanumeric(6)}`;

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// West of UTC, where UTC midnight is still the previous day. Date inputs
// showed stored dates a day early here and saved picked days a day late.
test.use({ timezoneId: 'America/Los_Angeles' });

/**
 * Seeds a fresh customer through the API and returns it.
 */
async function seedCustomer() {
  const auth = readApiAuth();
  const displayName = `E2E Date Customer ${faker.string.alphanumeric(6)}`;
  const customer = await createCustomerViaApi(API_BASE, auth, {
    displayName,
  });
  return { id: customer.id as number, displayName };
}

/**
 * Converts a calendar day's label (`Tue Sep 15 2026`) to `YYYY-MM-DD`.
 */
function labelToDate(label: string | null): string {
  const [, month, day, year] = (label ?? '').split(' ');
  const monthNumber = String(MONTHS.indexOf(month) + 1).padStart(2, '0');

  return `${year}-${monthNumber}-${day}`;
}

/**
 * Returns the input of the invoice date field.
 */
function invoiceDateInput(page: Page): Locator {
  return page
    .locator('.bp4-form-group')
    .filter({ hasText: 'Invoice Date' })
    .locator('input');
}

/**
 * Opens the calendar of the given date input and returns the day it has
 * selected, as `YYYY-MM-DD`. Reading the calendar rather than the input text
 * keeps the check independent of the organization's date format.
 */
async function openCalendarSelectedDay(page: Page, input: Locator) {
  await input.click();

  const selected = page.locator('.DayPicker-Day--selected');
  await expect(selected).toBeVisible({ timeout: 10_000 });

  return labelToDate(await selected.getAttribute('aria-label'));
}

test.describe('date inputs', () => {
  test.beforeAll(async () => {
    const auth = readApiAuth();

    // Seeds the item that the invoice forms select.
    await createItemViaApi(API_BASE, auth, {
      name: ITEM_NAME,
      type: 'service',
    });
  });

  test('should show today by default and save the day picked in the calendar.', async ({
    page,
  }) => {
    const customer = await seedCustomer();

    await page.goto('/invoices/new');
    await waitForInvoiceForm(page, 'New Invoice');
    await selectCustomer(page, customer.displayName);
    await selectEntryItem(page, ITEM_NAME);

    const today = await page.evaluate(() => {
      const now = new Date();
      const pad = (value: number) => String(value).padStart(2, '0');
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    });
    expect
      .soft(await openCalendarSelectedDay(page, invoiceDateInput(page)))
      .toBe(today);

    // Picks another day of the month shown in the calendar.
    const day = page
      .locator(
        '.DayPicker-Day:not(.DayPicker-Day--outside):not(.DayPicker-Day--selected):not(.DayPicker-Day--disabled)',
      )
      .first();
    const pickedDate = labelToDate(await day.getAttribute('aria-label'));
    await day.click();

    const createRequest = page.waitForRequest(
      (request) =>
        new URL(request.url()).pathname === '/api/sale-invoices' &&
        request.method() === 'POST',
      { timeout: 20_000 },
    );
    await page.getByRole('button', { name: 'Save as Draft' }).click();

    const body = (await createRequest).postDataJSON();
    expect(body.invoice_date ?? body.invoiceDate).toBe(pickedDate);

    await waitForInvoicesList(page);
  });

  test('should show the stored date on the edit form.', async ({ page }) => {
    const auth = readApiAuth();
    const customer = await seedCustomer();
    const itemId = await findItemIdByName(API_BASE, auth, ITEM_NAME);

    const invoice = await createDeliveredInvoiceViaApi(API_BASE, auth, {
      customerId: customer.id,
      itemId,
      rate: 100,
      date: '2026-08-31',
    });

    const invoiceResponse = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname ===
          `/api/sale-invoices/${invoice.id}` &&
        response.request().method() === 'GET',
      { timeout: 30_000 },
    );
    await page.goto(`/invoices/${invoice.id}/edit`);
    await waitForInvoiceForm(page, 'Edit Invoice');

    const served = await (await invoiceResponse).json();
    const servedDate: string = served.invoice_date ?? served.invoiceDate;

    // A server outside UTC sends the date at its own midnight, which the
    // browser cannot tell from any other instant.
    test.skip(
      servedDate !== '2026-08-31T00:00:00.000Z',
      `The server sent the invoice date as ${servedDate}, not at UTC midnight.`,
    );

    expect(await openCalendarSelectedDay(page, invoiceDateInput(page))).toBe(
      '2026-08-31',
    );
  });
});
