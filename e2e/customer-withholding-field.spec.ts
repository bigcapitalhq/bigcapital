import { test, expect, APIRequestContext } from '@playwright/test';
import crypto from 'crypto';

/**
 * UI e2e for the customer withholding-tax-rate field.
 *
 * Opens the real customer edit screen, verifies the "Withholding tax rate"
 * field renders with the persisted value, edits it through the form, saves,
 * and verifies persistence via the API and on reload.
 */
const SECRET = process.env.E2E_JWT_SECRET || '123123';
const EMAIL = process.env.E2E_USER_EMAIL || 'ravi.kaniyawala@gmail.com';
const ORG = process.env.E2E_ORGANIZATION_ID || '4yqtr1mr7c5gg4';
const BASE = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost';
const CUSTOMER_ID = 1; // Datacom - carries a 20% withholding rate.

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

const sessionCookies = (token: string) =>
  [
    { name: 'token', value: token },
    { name: 'authenticated_user_id', value: '1' },
    { name: 'organization_id', value: ORG },
    { name: 'tenant_id', value: '1' },
  ].map((c) => ({ ...c, url: BASE }));

async function setRate(
  request: APIRequestContext,
  token: string,
  rate: number | null,
) {
  const res = await request.put(`${BASE}/api/customers/${CUSTOMER_ID}`, {
    headers: apiHeaders(token),
    data: {
      customerType: 'business',
      currencyCode: 'NZD',
      displayName: 'Datacom Systems Limited',
      companyName: 'Datacom Systems Limited',
      withholdingTaxRate: rate,
    },
  });
  expect(res.status(), await res.text()).toBe(200);
}

async function getRate(
  request: APIRequestContext,
  token: string,
): Promise<number | null> {
  const res = await request.get(`${BASE}/api/customers/${CUSTOMER_ID}`, {
    headers: apiHeaders(token),
  });
  const body = await res.json();
  const customer = body?.data ?? body?.customer ?? body;
  const rate = customer.withholding_tax_rate;
  return rate === null || rate === undefined ? null : Number(rate);
}

test.describe('customer withholding tax rate field', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = mintToken();
    await setRate(request, token, 20);
  });

  test.afterAll(async ({ request }) => {
    // Restore the real configuration.
    await setRate(request, token, 20);
  });

  test('renders, edits and persists through the customer edit screen', async ({
    browser,
    request,
  }) => {
    const context = await browser.newContext({ baseURL: BASE });
    await context.addCookies(sessionCookies(token));
    const page = await context.newPage();

    await page.goto(`/customers/${CUSTOMER_ID}/edit`);

    const field = page.locator('input[name="withholding_tax_rate"]');
    await expect(field).toBeVisible({ timeout: 30_000 });
    await expect(field).toHaveValue('20');
    // The label renders from the locale string.
    await expect(page.locator('body')).toContainText('Withholding tax rate');

    // Edit through the form and save.
    await field.fill('25');
    // The primary floating action is labeled "Edit" in edit mode.
    await page.getByRole('button', { name: /^edit$/i }).first().click();
    await expect(page.locator('body')).toContainText(/edited successfully/i, {
      timeout: 30_000,
    });

    // Persisted via the API...
    await expect
      .poll(async () => getRate(request, token), { timeout: 15_000 })
      .toBe(25);

    // ...and round-trips on reload.
    await page.goto(`/customers/${CUSTOMER_ID}/edit`);
    await expect(page.locator('input[name="withholding_tax_rate"]')).toHaveValue(
      '25',
      { timeout: 30_000 },
    );
    await context.close();
  });

  test('saves with the field cleared (no withholding)', async ({
    browser,
    request,
  }) => {
    const context = await browser.newContext({ baseURL: BASE });
    await context.addCookies(sessionCookies(token));
    const page = await context.newPage();

    await page.goto(`/customers/${CUSTOMER_ID}/edit`);
    const field = page.locator('input[name="withholding_tax_rate"]');
    await expect(field).toBeVisible({ timeout: 30_000 });

    await field.fill('');
    await page.getByRole('button', { name: /^edit$/i }).first().click();
    await expect(page.locator('body')).toContainText(/edited successfully/i, {
      timeout: 30_000,
    });
    await expect
      .poll(async () => getRate(request, token), { timeout: 15_000 })
      .toBe(null);
    await context.close();
  });
});
