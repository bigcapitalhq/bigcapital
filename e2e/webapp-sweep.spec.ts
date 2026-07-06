import { test, expect } from '@playwright/test';
import crypto from 'crypto';

/**
 * Full-webapp smoke sweep: visits every reachable dashboard route and
 * records, per route: uncaught page errors, console errors, failed API
 * responses (>=500), and React error-boundary fallbacks. The single test
 * fails with the aggregated findings so one run reports everything.
 */
const SECRET = process.env.E2E_JWT_SECRET || '123123';
const EMAIL = process.env.E2E_USER_EMAIL || 'ravi.kaniyawala@gmail.com';
const ORG = process.env.E2E_ORGANIZATION_ID || '4yqtr1mr7c5gg4';
const BASE = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost';

// Real entities in the local tenant (edit routes need existing ids).
const IDS = {
  account: 1000,
  customer: 1,
  invoice: 2,
  item: 1000,
  journal: 1001,
  paymentReceived: 2,
};

const ROUTES: string[] = [
  '/',
  '/homepage',
  '/accounts',
  '/items',
  `/items/${IDS.item}/edit`,
  '/items/new',
  '/items/categories',
  '/inventory-adjustments',
  '/customers',
  `/customers/${IDS.customer}/edit`,
  '/customers/new',
  '/vendors',
  '/vendors/new',
  '/estimates',
  '/estimates/new',
  '/invoices',
  `/invoices/${IDS.invoice}/edit`,
  '/invoices/new',
  '/receipts',
  '/receipts/new',
  '/credit-notes',
  '/payments-received',
  `/payments-received/${IDS.paymentReceived}/edit`,
  '/payments-received/new',
  '/bills',
  '/bills/new',
  '/payments-made',
  '/payments-made/new',
  '/vendor-credits',
  '/expenses',
  '/expenses/new',
  '/manual-journals',
  `/manual-journals/${IDS.journal}/edit`,
  '/make-journal-entry',
  '/cashflow-accounts',
  `/cashflow-accounts/${IDS.account}/transactions`,
  `/cashflow-accounts/${IDS.account}/transactions?filter=uncategorized`,
  `/cashflow-accounts/${IDS.account}/import`,
  '/banking/rules',
  '/warehouses-transfers',
  '/transactions-locking',
  '/financial-reports/balance-sheet',
  '/financial-reports/profit-loss-sheet',
  '/financial-reports/trial-balance-sheet',
  '/financial-reports/general-ledger',
  '/financial-reports/journal-sheet',
  '/financial-reports/cash-flow',
  '/financial-reports/sales-tax-liability-summary',
  '/financial-reports/receivable-aging-summary',
  '/financial-reports/payable-aging-summary',
  '/financial-reports/customers-balance-summary',
  '/financial-reports/vendors-balance-summary',
  '/financial-reports/transactions-by-customers',
  '/financial-reports/transactions-by-vendors',
  '/financial-reports/sales-by-items',
  '/financial-reports/purchases-by-items',
  '/financial-reports/inventory-valuation',
  '/financial-reports/inventory-item-details',
  '/financial-reports/realized-gain-loss',
  '/financial-reports/unrealized-gain-loss',
  '/financial-reports/audit-log',
  '/preferences/general',
  '/preferences/users',
  '/preferences/currencies',
  '/preferences/branches',
  '/preferences/warehouses',
];

// Benign noise we deliberately ignore (3rd-party, favicons, websockets).
const IGNORED_CONSOLE = [
  /Download the React DevTools/i,
  /React Router Future Flag/i,
  /Warning: /, // React dev warnings - not user-facing failures
  /favicon/i,
  /posthog/i,
  /\[mobx\]/i,
];

function mintToken(): string {
  const b64u = (b: Buffer) => b.toString('base64url');
  const header = b64u(Buffer.from(JSON.stringify({ alg: 'HS384', typ: 'JWT' })));
  const now = Math.floor(Date.now() / 1000);
  const payload = b64u(
    Buffer.from(JSON.stringify({ sub: EMAIL, iat: now, exp: now + 7200 })),
  );
  const sig = crypto
    .createHmac('sha384', SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${sig}`;
}

test.describe('webapp route sweep', () => {
  test('every dashboard route renders without errors', async ({ browser }) => {
    test.setTimeout(15 * 60 * 1000);

    const token = mintToken();
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

    const findings: string[] = [];
    let currentRoute = '';

    page.on('pageerror', (err) => {
      findings.push(`[pageerror] ${currentRoute}: ${err.message.slice(0, 200)}`);
    });
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      if (IGNORED_CONSOLE.some((re) => re.test(text))) return;
      findings.push(`[console] ${currentRoute}: ${text.slice(0, 200)}`);
    });
    page.on('response', (res) => {
      if (res.status() >= 500 && res.url().includes('/api/')) {
        findings.push(
          `[api ${res.status()}] ${currentRoute}: ${res
            .url()
            .replace(BASE, '')
            .slice(0, 150)}`,
        );
      }
    });

    for (const route of ROUTES) {
      currentRoute = route;
      try {
        await page.goto(route, { waitUntil: 'networkidle', timeout: 45_000 });
      } catch (err) {
        findings.push(`[nav] ${route}: ${(err as Error).message.slice(0, 120)}`);
        continue;
      }
      // Small settle for late queries + pacing to stay under the API
      // throttle (sweep fires many requests; 429s would cascade into
      // false findings).
      await page.waitForTimeout(1500);

      const body = (await page.locator('body').innerText()).trim();
      if (body.includes('Something went wrong')) {
        findings.push(`[error-boundary] ${route}`);
      }
      if (body.length < 40) {
        findings.push(`[blank] ${route}: body="${body.slice(0, 40)}"`);
      }
    }
    await context.close();

    const deduped = Array.from(new Set(findings));
    expect(
      deduped,
      `Route sweep findings (${deduped.length}):\n` + deduped.join('\n'),
    ).toEqual([]);
  });
});
