import { test, expect, APIRequestContext } from '@playwright/test';
import crypto from 'crypto';

/**
 * UI e2e for per-customer withholding tax.
 *
 * The customer (id 1) carries withholdingTaxRate=20. An invoice of
 * 1,000.00 + 15% GST (total 1,150.00) is paid with the NET bank amount
 * only (950.00). The withheld 200.00 must be booked automatically into
 * the Withholding Tax Receivable account, so the webapp renders the
 * invoice as fully Paid - impossible without the companion booking.
 */
const SECRET = process.env.E2E_JWT_SECRET || '123123';
const EMAIL = process.env.E2E_USER_EMAIL || 'ravi.kaniyawala@gmail.com';
const ORG = process.env.E2E_ORGANIZATION_ID || '4yqtr1mr7c5gg4';
const BASE = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost';

const INVOICE_NO = 'E2E-WHT-1';

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

test.describe('per-customer withholding tax', () => {
  let token: string;
  let invoiceId: number;
  let paymentId: number;

  test.beforeAll(async ({ request }) => {
    token = mintToken();
    await deleteInvoiceByNo(request, token, INVOICE_NO);

    // The customer must carry the withholding rate.
    const cust = await request.put(`${BASE}/api/customers/1`, {
      headers: apiHeaders(token),
      data: {
        customerType: 'business',
        currencyCode: 'NZD',
        displayName: 'Datacom Systems Limited',
        companyName: 'Datacom Systems Limited',
        withholdingTaxRate: 20,
      },
    });
    expect(cust.status(), await cust.text()).toBe(200);

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
            description: 'E2E WHT line',
            taxRateId: 5,
          },
        ],
      },
    });
    expect(res.status(), await res.text()).toBe(201);
    invoiceId = (await res.json()).id;

    // Pay the NET bank amount only: 1,150 - 20% x 1,000 = 950.
    const pay = await request.post(`${BASE}/api/payments-received`, {
      headers: apiHeaders(token),
      data: {
        customerId: 1,
        paymentDate: '2026-07-01',
        depositAccountId: 1000,
        referenceNo: 'E2E WHT net payment',
        entries: [{ index: 1, invoiceId, paymentAmount: 950 }],
      },
    });
    expect(pay.status(), await pay.text()).toBe(201);
    paymentId = (await pay.json()).id;
  });

  test.afterAll(async ({ request }) => {
    if (paymentId) {
      await request.delete(`${BASE}/api/payments-received/${paymentId}`, {
        headers: apiHeaders(token),
      });
    }
    if (invoiceId) {
      await request.delete(`${BASE}/api/sale-invoices/${invoiceId}`, {
        headers: apiHeaders(token),
      });
    }
  });

  test('net-of-withholding payment renders the invoice as fully paid', async ({
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

    await page.goto('/invoices');
    const row = page.getByRole('row', { name: new RegExp(INVOICE_NO) });
    await expect(row).toContainText('1,150.00', { timeout: 30_000 });
    await expect(row).toContainText(/paid/i);
    // Fully paid - nothing left due on the row.
    await expect(row).not.toContainText(/partially/i);
    await context.close();
  });
});
