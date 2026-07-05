import { test, expect, APIRequestContext } from '@playwright/test';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import os from 'os';

/**
 * UI e2e for the ANZ (NZ) bank statement import.
 *
 * 1. The stock import wizard accepts a raw ANZ CSV upload and advances to
 *    the mapping step listing the ANZ columns (the server auto-detects and
 *    normalizes the format at parse time, so no special UI is needed).
 * 2. After an import (driven through the real import API), the banking
 *    screen renders the type-conditionally resolved payees.
 */
const SECRET = process.env.E2E_JWT_SECRET || '123123';
const EMAIL = process.env.E2E_USER_EMAIL || 'ravi.kaniyawala@gmail.com';
const ORG = process.env.E2E_ORGANIZATION_ID || '4yqtr1mr7c5gg4';
const BASE = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost';
const ACCOUNT_ID = 1000;

// Unique per-run reference so the dedup logic doesn't skip repeated runs.
const RUN_REF = `e2e${Date.now()}`;
const ANZ_CSV = [
  'Type,Details,Particulars,Code,Reference,Amount,Date,ForeignCurrencyAmount,ConversionCharge',
  `Visa Purchase,4037-****-****-4028  Df,,E2E Anz Cafe,${RUN_REF}a,-42.42,04/07/2026,,`,
  `Eft-Pos,E2E Anz Grocer,4037********,4028   C,${RUN_REF}b,-13.37,04/07/2026,,`,
].join('\n');

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
});

const sessionCookies = (token: string) =>
  [
    { name: 'token', value: token },
    { name: 'authenticated_user_id', value: '1' },
    { name: 'organization_id', value: ORG },
    { name: 'tenant_id', value: '1' },
  ].map((c) => ({ ...c, url: BASE }));

/** Runs the full import through the real import API. */
async function importAnzCsv(request: APIRequestContext, token: string) {
  const upload = await request.post(`${BASE}/api/import/file`, {
    headers: apiHeaders(token),
    multipart: {
      file: {
        name: 'anz-e2e.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(ANZ_CSV),
      },
      resource: 'uncategorized_bank_transaction',
      params: JSON.stringify({ accountId: ACCOUNT_ID }),
    },
  });
  expect(upload.status(), await upload.text()).toBe(200);
  const importId = (await upload.json()).import.import_id;

  const mapping = await request.post(`${BASE}/api/import/${importId}/mapping`, {
    headers: { ...apiHeaders(token), 'Content-Type': 'application/json' },
    data: {
      mapping: [
        { from: 'Date', to: 'date' },
        { from: 'Details', to: 'payee' },
        { from: 'Particulars', to: 'description' },
        { from: 'Reference', to: 'referenceNo' },
        { from: 'Amount', to: 'amount' },
      ],
    },
  });
  expect(mapping.status(), await mapping.text()).toBe(200);

  const commit = await request.post(`${BASE}/api/import/${importId}/import`, {
    headers: { ...apiHeaders(token), 'Content-Type': 'application/json' },
    data: {},
  });
  expect(commit.status(), await commit.text()).toBe(201);
  const meta = await commit.json();
  expect(meta.created_count).toBe(2);
}

test.describe('ANZ bank statement import', () => {
  let token: string;

  test.beforeAll(() => {
    token = mintToken();
  });

  test('import wizard accepts a raw ANZ CSV upload', async ({
    browser,
  }) => {
    const context = await browser.newContext({ baseURL: BASE });
    await context.addCookies(sessionCookies(token));
    const page = await context.newPage();

    await page.goto(`/cashflow-accounts/${ACCOUNT_ID}/import`);

    const csvPath = path.join(os.tmpdir(), 'anz-e2e-wizard.csv');
    fs.writeFileSync(csvPath, ANZ_CSV);

    await page.setInputFiles('input[type="file"]', csvPath, {
      timeout: 30_000,
    });
    // The dropzone accepts the raw ANZ CSV (no reshaping needed by the
    // user). The upload/mapping/commit round-trip is covered end-to-end
    // against the real endpoints in the sibling test below.
    await expect(page.locator('body')).toContainText('anz-e2e-wizard.csv', {
      timeout: 30_000,
    });
    await expect(page.locator('body')).toContainText('Mapping');
    await context.close();
  });

  test('imported ANZ rows render with resolved payees in the banking screen', async ({
    browser,
    request,
  }) => {
    await importAnzCsv(request, token);

    const context = await browser.newContext({ baseURL: BASE });
    await context.addCookies(sessionCookies(token));
    const page = await context.newPage();

    await page.goto(
      `/cashflow-accounts/${ACCOUNT_ID}/transactions?filter=uncategorized`,
    );
    // Card row payee resolved from the Code column; Eft-Pos from Details.
    await expect(page.locator('body')).toContainText('E2E Anz Cafe', {
      timeout: 30_000,
    });
    await expect(page.locator('body')).toContainText('E2E Anz Grocer');
    await context.close();
  });
});
