import { test, expect, APIRequestContext } from '@playwright/test';
import crypto from 'crypto';

/**
 * UI e2e for the invoice tax-engine GL fix.
 *
 * Creates a tax-EXCLUSIVE invoice (1,000.00 + 15% GST) through the API and
 * asserts the webapp renders the tax-included total (1,150.00). Before the
 * fix the total omitted the tax amount for exclusive-tax invoices, so the
 * UI displayed 1,000.00 and the posted GL entries were unbalanced.
 *
 * Auth: mints the same HS384 JWT the server issues (dev fallback secret)
 * and injects the session cookies the webapp reads - no new user accounts.
 */
// NOTE: deliberately NOT process.env.APP_JWT_SECRET - the root .env (loaded
// by playwright.config.ts via dotenv) may define it while the server container
// still runs on the built-in dev fallback secret.
const SECRET = process.env.E2E_JWT_SECRET || '123123';
const EMAIL = process.env.E2E_USER_EMAIL || 'ravi.kaniyawala@gmail.com';
const ORG = process.env.E2E_ORGANIZATION_ID || '4yqtr1mr7c5gg4';
const BASE = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost';

const INVOICE_NO = 'E2E-GST-1';

function mintToken(): string {
  const b64u = (b: Buffer) => b.toString('base64url');
  const header = b64u(Buffer.from(JSON.stringify({ alg: 'HS384', typ: 'JWT' })));
  const now = Math.floor(Date.now() / 1000);
  const payload = b64u(
    Buffer.from(JSON.stringify({ sub: EMAIL, iat: now, exp: now + 3600 })),
  );
  const sig = crypto
    .createHmac('sha384', SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${sig}`;
}

const apiHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'organization-id': ORG,
  'Content-Type': 'application/json',
});

async function deleteInvoiceByNo(
  request: APIRequestContext,
  token: string,
  invoiceNo: string,
) {
  const res = await request.get(
    `${BASE}/api/sale-invoices?search_keyword=${invoiceNo}`,
    { headers: apiHeaders(token) },
  );
  if (!res.ok()) return;
  const body = await res.json();
  const invoices = body?.data ?? body?.sales_invoices ?? [];
  for (const invoice of invoices) {
    if (invoice.invoice_no === invoiceNo) {
      await request.delete(`${BASE}/api/sale-invoices/${invoice.id}`, {
        headers: apiHeaders(token),
      });
    }
  }
}

test.describe('invoice tax GL fix', () => {
  let token: string;
  let invoiceId: number;

  test.beforeAll(async ({ request }) => {
    token = mintToken();
    // Clean up leftovers from previous runs, then create the fixture invoice.
    await deleteInvoiceByNo(request, token, INVOICE_NO);

    const res = await request.post(`${BASE}/api/sale-invoices`, {
      headers: apiHeaders(token),
      data: {
        customerId: 1,
        invoiceDate: '2026-06-30',
        dueDate: '2026-07-31',
        delivered: true,
        isInclusiveTax: false,
        invoiceNo: INVOICE_NO,
        entries: [
          {
            index: 1,
            itemId: 1000,
            quantity: 1,
            rate: 1000,
            description: 'E2E exclusive GST line',
            taxRateId: 5,
          },
        ],
      },
    });
    expect(res.status(), await res.text()).toBe(201);
    invoiceId = (await res.json()).id;
  });

  test.afterAll(async ({ request }) => {
    if (invoiceId) {
      await request.delete(`${BASE}/api/sale-invoices/${invoiceId}`, {
        headers: apiHeaders(token),
      });
    }
  });

  test('invoice list renders the tax-included total', async ({ browser }) => {
    const context = await browser.newContext({ baseURL: BASE });
    await context.addCookies(
      [
        { name: 'token', value: token },
        { name: 'authenticated_user_id', value: '1' },
        { name: 'organization_id', value: ORG },
        { name: 'tenant_id', value: '1' },
      ].map((c) => ({ ...c, url: BASE })),
    );
    const page = await context.newPage();

    await page.goto('/invoices');
    await expect(page.locator('body')).toContainText(INVOICE_NO, {
      timeout: 30_000,
    });
    // 1,000.00 + 15% GST - the buggy total rendered 1,000.00.
    await expect(page.locator('body')).toContainText('1,150.00');
    await context.close();
  });

  test('sales tax liability report renders the GST rate row', async ({
    browser,
  }) => {
    const context = await browser.newContext({ baseURL: BASE });
    await context.addCookies(
      [
        { name: 'token', value: token },
        { name: 'authenticated_user_id', value: '1' },
        { name: 'organization_id', value: ORG },
        { name: 'tenant_id', value: '1' },
      ].map((c) => ({ ...c, url: BASE })),
    );
    const page = await context.newPage();

    await page.goto('/financial-reports/sales-tax-liability-summary');
    // The report is populated natively from tax_rate_id-tagged GL rows.
    await expect(page.locator('body')).toContainText('GST', {
      timeout: 30_000,
    });
    await context.close();
  });
});
