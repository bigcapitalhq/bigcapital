import { test, expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createExpenseViaApi, readApiAuth } from './_api';

const API_BASE = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:3000';

const seedReferenceNo = () =>
  `BS-${faker.string.alphanumeric(6).toUpperCase()}`;

const seedAmount = () => faker.number.int({ min: 1000, max: 50000 });

/**
 * Waits until the balance sheet page is loaded.
 */
async function waitForBalanceSheetPage(page: Page) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    'Balance Sheet',
    { timeout: 30_000 },
  );
}

/**
 * Waits until the balance sheet report table is rendered with data.
 */
async function waitForBalanceSheetData(page: Page) {
  await expect(
    page.getByTestId('balance-sheet-row--TOTAL--ASSETS'),
  ).toBeVisible({ timeout: 30_000 });
}

test.describe('balance sheet', () => {
  test.beforeAll(async () => {
    // Seeds the shared organization ledger with at least one posted expense
    // so the balance sheet report renders rows (an empty ledger is
    // suppressed by the report and shows a "no results" table).
    await createExpenseViaApi(API_BASE, readApiAuth(), {
      referenceNo: seedReferenceNo(),
      amount: seedAmount(),
    });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/financial-reports/balance-sheet');
    await waitForBalanceSheetPage(page);
  });

  test('should show the balance sheet page with its actions bar.', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: 'Re-calc Report' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Customize Report' }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Format' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Print' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export' })).toBeVisible();
  });

  test('should render the financial sheet header and accounting basis.', async ({
    page,
  }) => {
    await waitForBalanceSheetData(page);

    await expect(page.getByTestId('financial-sheet-type')).toHaveText(
      'Balance Sheet',
    );
    await expect(page.getByTestId('financial-sheet-title')).toBeVisible();
    await expect(page.getByTestId('financial-sheet-date')).toBeVisible();
    await expect(
      page.getByTestId('financial-sheet-accounting-basis'),
    ).toContainText('Cash');
  });

  test('should render the balance sheet sections and totals.', async ({
    page,
  }) => {
    await waitForBalanceSheetData(page);

    // Guaranteed-present aggregate sections (always-shown schema nodes or
    // sections holding the seeded expense balances). Empty sections (e.g.
    // Liabilities) are suppressed by the default "without zero-balance"
    // filter and are intentionally not asserted.
    for (const id of [
      'ASSETS',
      'CURRENT_ASSETS',
      'CASH_EQUIVALENTS',
      'LIABILITY_EQUITY',
      'EQUITY',
    ]) {
      await expect(
        page.getByTestId(`balance-sheet-row--AGGREGATE--${id}`),
      ).toBeVisible();
    }
    await expect(
      page.getByTestId('balance-sheet-row--TOTAL--ASSETS'),
    ).toBeVisible();
    await expect(
      page.getByTestId('balance-sheet-row--TOTAL--LIABILITY_EQUITY'),
    ).toBeVisible();
  });

  test('should keep the balance sheet equation balanced.', async ({ page }) => {
    await waitForBalanceSheetData(page);

    const totalAssets = page.getByTestId(
      'balance-sheet-cell--TOTAL--ASSETS--total',
    );
    const totalLiabilitiesEquity = page.getByTestId(
      'balance-sheet-cell--TOTAL--LIABILITY_EQUITY--total',
    );

    await expect(totalAssets).not.toHaveText('');
    await expect(totalLiabilitiesEquity).not.toHaveText('');

    const assetsText = (await totalAssets.innerText()).trim();
    const liabilitiesEquityText = (await totalLiabilitiesEquity.innerText()).trim();

    expect(assetsText).not.toBe('');
    expect(liabilitiesEquityText).not.toBe('');
    expect(assetsText).toBe(liabilitiesEquityText);
  });

  test('should expand and collapse account rows within a section.', async ({
    page,
  }) => {
    await waitForBalanceSheetData(page);

    const cashEquivalents = page.getByTestId(
      'balance-sheet-row--AGGREGATE--CASH_EQUIVALENTS',
    );
    const pettyCashRow = page
      .getByTestId(/^balance-sheet-row--ACCOUNT/)
      .filter({ hasText: 'Petty Cash' });

    // Account rows under a section are rendered by default.
    await expect(pettyCashRow).toBeVisible({ timeout: 15_000 });

    // Collapsing the section hides its account rows.
    await cashEquivalents.getByTestId('expand-toggle').click();
    await expect(pettyCashRow).toHaveCount(0, { timeout: 15_000 });

    // Expanding the section shows the account rows again.
    await cashEquivalents.getByTestId('expand-toggle').click();
    await expect(pettyCashRow).toBeVisible({ timeout: 15_000 });
  });

  test('should customize the report accounting basis through the filter drawer.', async ({
    page,
  }) => {
    await waitForBalanceSheetData(page);
    await expect(
      page.getByTestId('financial-sheet-accounting-basis'),
    ).toContainText('Cash');

    await page.getByRole('button', { name: 'Customize Report' }).click();

    const drawer = page.getByTestId('financial-report-drawer');
    await expect(drawer).toBeVisible({ timeout: 15_000 });
    await expect(drawer.getByRole('radio', { name: 'Accrual' })).toBeVisible();

    // Click the radio directly (some environments inject the TanStack Query
    // Devtools overlay which intercepts pointer events; element.click()
    // bypasses it and still fires the React change event that updates the
    // form).
    await drawer
      .getByRole('radio', { name: 'Accrual' })
      .evaluate((el) => (el as HTMLInputElement).click());

    // Submit the form directly for the same reason as the radio above.
    await drawer
      .getByRole('button', { name: 'Calculate report' })
      .evaluate((el) => (el as HTMLButtonElement).click());

    await expect(
      page.getByTestId('financial-sheet-accounting-basis'),
    ).toContainText('Accrual', { timeout: 30_000 });
  });
});
