import { test, expect, type Locator, type Page } from '@playwright/test';
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
  waitForCostCompute,
} from './_api';

const API_BASE = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:3000';

// Unique names so reseeding within a run never collides with existing rows.
const CUSTOMER_NAME = `E2E NF Customer ${faker.string.alphanumeric(6)}`;
const VENDOR_NAME = `E2E NF Vendor ${faker.string.alphanumeric(6)}`;
const ITEM_NAME = `E2E NF Item ${faker.string.alphanumeric(6)}`;
const TAX_RATE_NAME = `E2E NF VAT ${faker.string.alphanumeric(4)}`;
const TAX_RATE_CODE = `NF-VAT-${faker.string.alphanumeric(4)}`;

/**
 * A report page exposing the number-format dropdown. `rowPrefix` is the
 * report table row test-id prefix; reports without one (realized/unrealized
 * gain or loss) never render data rows.
 */
interface ReportConfig {
  title: string;
  path: string;
  rowPrefix?: string;
}

const REPORTS: ReportConfig[] = [
  {
    title: 'Balance Sheet',
    path: '/financial-reports/balance-sheet',
    rowPrefix: 'balance-sheet',
  },
  {
    title: 'Trial Balance Sheet',
    path: '/financial-reports/trial-balance-sheet',
    rowPrefix: 'trial-balance',
  },
  {
    title: 'Profit/Loss Sheet',
    path: '/financial-reports/profit-loss-sheet',
    rowPrefix: 'profit-loss',
  },
  {
    title: 'Cash Flow Statement',
    path: '/financial-reports/cash-flow',
    rowPrefix: 'cash-flow',
  },
  {
    title: 'Receivable Aging Summary',
    path: '/financial-reports/receivable-aging-summary',
    rowPrefix: 'ar-aging',
  },
  {
    title: 'Payable Aging Summary',
    path: '/financial-reports/payable-aging-summary',
    rowPrefix: 'ap-aging',
  },
  {
    title: 'Customers Balance Summary',
    path: '/financial-reports/customers-balance-summary',
    rowPrefix: 'customers-balance',
  },
  {
    title: 'Vendors Balance Summary',
    path: '/financial-reports/vendors-balance-summary',
    rowPrefix: 'vendors-balance',
  },
  {
    title: 'Customers Transactions',
    path: '/financial-reports/transactions-by-customers',
    rowPrefix: 'customers-transactions',
  },
  {
    title: 'Vendors Transactions',
    path: '/financial-reports/transactions-by-vendors',
    rowPrefix: 'vendors-transactions',
  },
  {
    title: 'Sales by items',
    path: '/financial-reports/sales-by-items',
    rowPrefix: 'sales-by-items',
  },
  {
    title: 'Purchases by items',
    path: '/financial-reports/purchases-by-items',
    rowPrefix: 'purchases-by-items',
  },
  {
    title: 'Inventory valuation',
    path: '/financial-reports/inventory-valuation',
    rowPrefix: 'inventory-valuation',
  },
  {
    title: 'Inventory Item Details',
    path: '/financial-reports/inventory-item-details',
    rowPrefix: 'inventory-item-details',
  },
  {
    title: 'Sales Tax Liability Summary',
    // The seeded invoice is not paid, so tax is only recognised on the
    // accrual basis (the report page defaults to cash).
    path: '/financial-reports/sales-tax-liability-summary?basis=accrual',
    rowPrefix: 'sales-tax-liability',
  },
  {
    title: 'Realized Gain or Loss',
    path: '/financial-reports/realized-gain-loss',
  },
  {
    title: 'Unrealized Gain or Loss',
    path: '/financial-reports/unrealized-gain-loss',
  },
];

const ROW_BEARING_REPORTS = REPORTS.filter(
  (report): report is ReportConfig & { rowPrefix: string } =>
    !!report.rowPrefix,
);

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

/**
 * Opens the number-format dropdown if it is not already open.
 */
async function openNumberFormat(page: Page) {
  const dropdown = page.locator('.number-format-dropdown');
  if (!(await dropdown.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: 'Format' }).click();
    await expect(dropdown).toBeVisible({ timeout: 15_000 });
  }
}

/**
 * Asserts the six number-format fields and the footer buttons are rendered.
 */
async function assertNumberFormatFields(page: Page) {
  const dropdown = page.locator('.number-format-dropdown');

  for (const label of ['Negative format', 'Decimal places', 'Money format']) {
    await expect(
      dropdown.locator('.bp4-form-group').filter({ hasText: label }),
    ).toBeVisible();
  }
  for (const label of [
    'Show zero.',
    'Show negative in red.',
    'Divide on 1000.',
  ]) {
    await expect(dropdown.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(dropdown.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(dropdown.getByRole('button', { name: 'Run' })).toBeVisible();
}

/**
 * Selects an option from one of the number-format selects by its field label.
 *
 * The clicks run through `element.click()` to bypass the TanStack Query
 * Devtools overlay that may otherwise intercept pointer events (same approach
 * as the balance sheet spec).
 */
async function selectOptionInDropdown(
  page: Page,
  fieldLabel: string,
  optionText: string,
) {
  const dropdown = page.locator('.number-format-dropdown');
  const group = dropdown
    .locator('.bp4-form-group')
    .filter({ hasText: fieldLabel });

  await group.locator('button').evaluate((el) => (el as HTMLElement).click());
  await page
    .getByRole('menuitem', { name: optionText, exact: true })
    .evaluate((el) => (el as HTMLElement).click());
}

/**
 * Toggles one of the number-format switches by its label.
 */
async function toggleSwitch(page: Page, label: string) {
  const dropdown = page.locator('.number-format-dropdown');
  await dropdown
    .getByText(label, { exact: true })
    .evaluate((el) => (el as HTMLElement).click());
}

/**
 * Submits the number-format form (Run).
 */
async function submitNumberFormat(page: Page) {
  const dropdown = page.locator('.number-format-dropdown');
  const run = dropdown.getByRole('button', { name: 'Run' });
  await expect(run).toBeEnabled();
  await run.evaluate((el) => (el as HTMLButtonElement).click());
}

interface MoneyCell {
  rowTestId: string;
  cellIndex: number;
  text: string;
}

const WHOLE_NUMBER_RE = /^\s*[^0-9]*[0-9][0-9,]*\s*$/;

/**
 * Locates the first row-tagged money cell within the given report table.
 * Reports other than the balance sheet only tag rows, so the money cell is
 * resolved by scanning the `.td` cells inside each row. Percentage cells and
 * zero-value cells are skipped because they are not reformatted by the
 * number-format settings.
 */
function captureFirstMoneyCell(
  page: Page,
  prefix: string,
  rowType?: string,
): Promise<MoneyCell | null> {
  return page.locator(`[data-testId^="${prefix}-row--"]`).evaluateAll(
    (rows, { rowType }) => {
      const moneyCellRe = /^\s*[^0-9]*[0-9][0-9,]*\.\d+\s*$/;
      for (const row of rows) {
        const rowTestId = row.getAttribute('data-testId') ?? '';
        if (rowType && !rowTestId.includes(`--${rowType}--`)) {
          continue;
        }
        const cells = Array.from(row.querySelectorAll('.td'));
        for (let index = 0; index < cells.length; index++) {
          const text = (cells[index].textContent ?? '').trim();
          const cleaned = text.replace(/[^0-9.,-]/g, '').replace(/,/g, '');
          const numeric = parseFloat(cleaned);
          if (
            moneyCellRe.test(text) &&
            !text.includes('%') &&
            Number.isFinite(numeric) &&
            numeric !== 0
          ) {
            return { rowTestId, cellIndex: index, text };
          }
        }
      }
      return null;
    },
    { rowType },
  );
}

const moneyCellLocator = (page: Page, cell: MoneyCell) =>
  page
    .locator(`[data-testId="${cell.rowTestId}"]`)
    .locator('.td')
    .nth(cell.cellIndex);

/**
 * Parses a server-formatted amount like "AED1,234.56", "1,234.56" or
 * "(AED1,234.56)" back into a number.
 */
function parseFormattedAmount(text: string): number {
  const negative = text.includes('(');
  const cleaned = text.replace(/[()]/g, '').replace(/[^0-9.,-]/g, '');
  const amount = parseFloat(cleaned.replace(/,/g, ''));
  return Number.isFinite(amount) ? (negative ? -Math.abs(amount) : amount) : 0;
}

// --color-financial-sheet-negative-amount-text resolves to --color-red-500
// (#fa999c) in the dark theme the webapp starts in (index.html sets
// bp4-dark on <body>), and to --color-red-400 (#ac2f33) in the light theme.
const NEGATIVE_RED_DARK = 'rgb(250, 153, 156)';
const NEGATIVE_RED_LIGHT = 'rgb(172, 47, 51)';

// A non-negative amount: an optional currency symbol, then a digit.
const POSITIVE_AMOUNT_RE = /^\s*[^-(\s\d]*\d/;

/**
 * Locates the inner element of a column's cell in the account row whose text
 * contains the given account name.
 */
const accountCell = (
  page: Page,
  prefix: string,
  accountName: string,
  columnId: string,
): Locator =>
  page
    .getByTestId(new RegExp(`^${prefix}-row--ACCOUNT`))
    .filter({ hasText: accountName })
    .locator(`.td-${columnId} .cell-inner`);

/**
 * Locates the inner element of the first account row cell in the given
 * column that holds a non-negative amount.
 */
async function firstPositiveAccountCell(
  page: Page,
  prefix: string,
  columnId: string,
): Promise<Locator | null> {
  const rowTestId = await page
    .getByTestId(new RegExp(`^${prefix}-row--ACCOUNT`))
    .evaluateAll(
      (rows, { columnId, source }) => {
        const positiveRe = new RegExp(source);
        for (const row of rows) {
          const text = row.querySelector(`.td-${columnId}`)?.textContent ?? '';
          if (positiveRe.test(text)) {
            return row.getAttribute('data-testId');
          }
        }
        return null;
      },
      { columnId, source: POSITIVE_AMOUNT_RE.source },
    );
  return rowTestId
    ? page.locator(`[data-testId="${rowTestId}"] .td-${columnId} .cell-inner`)
    : null;
}

/**
 * Appends the "Show negative in red." number format to a report path.
 */
const withShowInRed = (path: string): string =>
  `${path}${path.includes('?') ? '&' : '?'}numberFormat[showInRed]=true`;

/**
 * Checks, with the switch on, that a report cell is red exactly when it is
 * marked as a negative amount, and that every marked cell shows its sign.
 * A probe cell added to the report's first row checks that the report
 * colours negative cells at all, even when its data has none.
 * Returns the number of marked cells and a description of each problem.
 */
function auditNegativeColours(
  page: Page,
  prefix: string,
): Promise<{ marked: number; problems: string[] }> {
  return page.evaluate((prefix) => {
    const problems: string[] = [];
    const token = getComputedStyle(document.body)
      .getPropertyValue('--color-financial-sheet-negative-amount-text')
      .trim();
    if (!token) {
      problems.push('negative colour token is not defined');
    }
    const colourProbe = document.createElement('span');
    colourProbe.style.color =
      'var(--color-financial-sheet-negative-amount-text)';
    document.body.appendChild(colourProbe);
    const red = getComputedStyle(colourProbe).color;
    colourProbe.remove();

    const firstRow = document.querySelector(`[data-testId^="${prefix}-row--"]`);
    if (firstRow) {
      const cellProbe = document.createElement('div');
      cellProbe.className = 'td is-negative-amount';
      cellProbe.innerHTML = '<div class="cell-inner">-1.00</div>';
      firstRow.appendChild(cellProbe);
      const probeColour = getComputedStyle(
        cellProbe.firstElementChild as Element,
      ).color;
      cellProbe.remove();
      if (probeColour !== red) {
        problems.push('the report does not colour negative cells');
      }
    } else {
      problems.push('the report has no rows');
    }

    let marked = 0;
    document
      .querySelectorAll(`[data-testId^="${prefix}-row--"]`)
      .forEach((row) => {
        const rowTestId = row.getAttribute('data-testId');
        row.querySelectorAll('.td').forEach((cell, index) => {
          const inner = cell.querySelector('.cell-inner');
          if (!inner) {
            return;
          }
          const text = (cell.textContent ?? '').trim();
          const isMarked = cell.classList.contains('is-negative-amount');
          const isRed = getComputedStyle(inner).color === red;

          if (isMarked) {
            marked += 1;
          }
          if (isMarked !== isRed) {
            problems.push(
              `${rowTestId} cell ${index} "${text}": marked=${isMarked} red=${isRed}`,
            );
          }
          if (isMarked && !/^\s*[-(]/.test(text)) {
            problems.push(
              `${rowTestId} cell ${index} "${text}": marked without a sign`,
            );
          }
        });
      });
    return { marked, problems };
  }, prefix);
}

test.describe('number format', () => {
  test.beforeAll(async () => {
    const auth = readApiAuth();

    // Seeds a "kitchen-sink" dataset so every report category renders rows
    // (same strategy as the financial reports spec): an expense, a
    // customer/vendor pair, an inventory item, a non-zero tax rate, an opened
    // bill and a delivered invoice.

    await createExpenseViaApi(API_BASE, auth, {
      referenceNo: `NF-${faker.string.alphanumeric(6).toUpperCase()}`,
      amount: faker.number.int({ min: 1000, max: 50000 }),
    });

    const customerResult = await createCustomerViaApi(API_BASE, auth, {
      displayName: CUSTOMER_NAME,
    });
    const vendorResult = await createVendorViaApi(API_BASE, auth, {
      displayName: VENDOR_NAME,
    });

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

  for (const report of REPORTS) {
    test(`should expose the number format fields in the ${report.title} report.`, async ({
      page,
    }) => {
      await page.goto(report.path);
      await waitForReportPage(page, report.title);
      if (report.rowPrefix) {
        await waitForReportRows(page, report.rowPrefix);
      }
      await openNumberFormat(page);
      await assertNumberFormatFields(page);
    });
  }

  for (const report of ROW_BEARING_REPORTS) {
    test(`should apply the decimal places setting to the ${report.title} report.`, async ({
      page,
    }) => {
      await page.goto(report.path);
      await waitForReportPage(page, report.title);
      await waitForReportRows(page, report.rowPrefix);

      const cell = await captureFirstMoneyCell(page, report.rowPrefix);

      await openNumberFormat(page);
      await selectOptionInDropdown(page, 'Decimal places', '$1');
      await submitNumberFormat(page);

      // The precision query param reached the URL query string.
      await expect(page).toHaveURL(/numberFormat%5Bprecision%5D=0/, {
        timeout: 15_000,
      });

      // Reports without non-zero amounts (e.g. purchases by items) only
      // assert the setting propagation; the rest re-render the amount as a
      // whole number.
      if (cell) {
        await expect(moneyCellLocator(page, cell)).toHaveText(WHOLE_NUMBER_RE, {
          timeout: 30_000,
        });
      }
    });
  }

  for (const report of ROW_BEARING_REPORTS) {
    test(`should divide the ${report.title} report amounts by 1000.`, async ({
      page,
    }) => {
      // The inventory cost-compute job can change report amounts while it
      // runs. Wait for it first so the baseline cell below is not stale.
      test.setTimeout(180_000);
      await waitForCostCompute(API_BASE, readApiAuth());

      await page.goto(report.path);
      await waitForReportPage(page, report.title);
      await waitForReportRows(page, report.rowPrefix);

      const cell = await captureFirstMoneyCell(page, report.rowPrefix);
      const before = cell ? parseFormattedAmount(cell.text) : 0;

      await openNumberFormat(page);
      await toggleSwitch(page, 'Divide on 1000.');
      await submitNumberFormat(page);

      // The divide-on-1000 query param reached the URL query string.
      await expect(page).toHaveURL(/numberFormat%5BdivideOn1000%5D=true/, {
        timeout: 15_000,
      });

      if (cell) {
        const cellLocator = moneyCellLocator(page, cell);

        // The report clears its rows while it refetches after the
        // number-format change, so wait until the money cell is back in the
        // DOM and reflects the divided amount (allow 2-decimal rounding error).
        await expect
          .poll(
            async () => {
              const text = await cellLocator.textContent();
              // Missing/empty cell: keep polling instead of parsing as 0.
              const after = text === null ? NaN : parseFormattedAmount(text);
              return Math.abs(after * 1000 - before);
            },
            { timeout: 30_000 },
          )
          .toBeLessThan(10);
      }
    });
  }

  test('should apply the money format setting to the balance sheet.', async ({
    page,
  }) => {
    await page.goto('/financial-reports/balance-sheet');
    await waitForReportPage(page, 'Balance Sheet');
    await waitForReportRows(page, 'balance-sheet');

    // A regular account row renders amounts without a currency symbol under
    // the default "total" money format.
    const accountCell = await captureFirstMoneyCell(
      page,
      'balance-sheet',
      'ACCOUNT',
    );
    expect(accountCell).not.toBeNull();
    await expect(moneyCellLocator(page, accountCell!)).not.toContainText('AED');

    // "Always" formats every amount with the currency symbol.
    await openNumberFormat(page);
    await selectOptionInDropdown(page, 'Money format', 'Always');
    await submitNumberFormat(page);
    await expect(page).toHaveURL(/numberFormat%5BformatMoney%5D=always/, {
      timeout: 15_000,
    });
    await expect(moneyCellLocator(page, accountCell!)).toContainText('AED', {
      timeout: 30_000,
    });

    // "None" removes the currency symbol even from the total rows.
    await openNumberFormat(page);
    await selectOptionInDropdown(page, 'Money format', 'None');
    await submitNumberFormat(page);
    await expect(page).toHaveURL(/numberFormat%5BformatMoney%5D=none/, {
      timeout: 15_000,
    });

    const totalAssets = page.getByTestId(
      'balance-sheet-cell--TOTAL--ASSETS--total',
    );
    await expect(totalAssets).not.toHaveText('');
    await expect(totalAssets).not.toContainText('AED');
  });

  test('should show negative amounts in red on the balance sheet when the switch is on.', async ({
    page,
  }) => {
    // On the accrual basis the seeded unpaid invoice and bill give accounts
    // with positive balances (the page defaults to cash).
    await page.goto('/financial-reports/balance-sheet?basis=accrual');
    await waitForReportPage(page, 'Balance Sheet');
    await waitForReportRows(page, 'balance-sheet');

    // Expenses are paid from Petty Cash, so its balance is negative.
    const pettyCash = accountCell(page, 'balance-sheet', 'Petty Cash', 'total');
    await expect(pettyCash).toHaveText(/^\s*-/);
    const positive = await firstPositiveAccountCell(
      page,
      'balance-sheet',
      'total',
    );
    expect(positive).not.toBeNull();

    // While the switch is off, the negative cell has the normal colour.
    const normalColour = await pettyCash.evaluate(
      (el) => getComputedStyle(el).color,
    );
    const positiveColour = await positive!.evaluate(
      (el) => getComputedStyle(el).color,
    );
    expect(normalColour).toBe(positiveColour);

    await openNumberFormat(page);
    await toggleSwitch(page, 'Show negative in red.');
    await submitNumberFormat(page);
    await expect(page).toHaveURL(/numberFormat%5BshowInRed%5D=true/, {
      timeout: 15_000,
    });
    await expect(pettyCash).toHaveCSS('color', NEGATIVE_RED_DARK, {
      timeout: 30_000,
    });
    await expect(positive!).toHaveCSS('color', positiveColour);

    const audit = await auditNegativeColours(page, 'balance-sheet');
    expect(audit.problems).toEqual([]);
    expect(audit.marked).toBeGreaterThan(0);

    // Turning the switch off restores the normal colour.
    await openNumberFormat(page);
    await toggleSwitch(page, 'Show negative in red.');
    await submitNumberFormat(page);
    await expect(page).toHaveURL(/numberFormat%5BshowInRed%5D=false/, {
      timeout: 15_000,
    });
    await expect(pettyCash).toHaveCSS('color', normalColour, {
      timeout: 30_000,
    });
  });

  test('should show negative amounts in red in the light theme from a shared link.', async ({
    page,
  }) => {
    await page.goto(withShowInRed('/financial-reports/balance-sheet'));
    await waitForReportPage(page, 'Balance Sheet');
    await waitForReportRows(page, 'balance-sheet');

    // Switch to the light theme the way the theme hotkey does.
    await page.evaluate(() => document.body.classList.remove('bp4-dark'));
    await expect(
      accountCell(page, 'balance-sheet', 'Petty Cash', 'total'),
    ).toHaveCSS('color', NEGATIVE_RED_LIGHT, { timeout: 30_000 });

    // The switch reflects the setting carried by the link.
    await openNumberFormat(page);
    await expect(
      page
        .locator('.number-format-dropdown')
        .getByLabel('Show negative in red.'),
    ).toBeChecked();
  });

  test('should show parenthesised negative amounts in red.', async ({
    page,
  }) => {
    await page.goto('/financial-reports/balance-sheet');
    await waitForReportPage(page, 'Balance Sheet');
    await waitForReportRows(page, 'balance-sheet');

    await openNumberFormat(page);
    await selectOptionInDropdown(page, 'Negative format', '($1000)');
    await toggleSwitch(page, 'Show negative in red.');
    await submitNumberFormat(page);
    await expect(page).toHaveURL(
      /numberFormat%5BnegativeFormat%5D=parentheses/,
      { timeout: 15_000 },
    );
    await expect(page).toHaveURL(/numberFormat%5BshowInRed%5D=true/);

    const pettyCash = accountCell(page, 'balance-sheet', 'Petty Cash', 'total');
    await expect(pettyCash).toHaveText(/^\s*\(.*\)\s*$/, { timeout: 30_000 });
    await expect(pettyCash).toHaveCSS('color', NEGATIVE_RED_DARK);
  });

  test('should show negative amounts in red on the trial balance sheet.', async ({
    page,
  }) => {
    await page.goto('/financial-reports/trial-balance-sheet');
    await waitForReportPage(page, 'Trial Balance Sheet');
    await waitForReportRows(page, 'trial-balance');

    // Petty Cash only receives credits, and the balance is debit - credit.
    const balance = accountCell(page, 'trial-balance', 'Petty Cash', 'total');
    const credit = accountCell(page, 'trial-balance', 'Petty Cash', 'credit');
    await expect(balance).toHaveText(/^\s*-/);
    await expect(credit).toHaveText(POSITIVE_AMOUNT_RE);
    const creditColour = await credit.evaluate(
      (el) => getComputedStyle(el).color,
    );

    await openNumberFormat(page);
    await toggleSwitch(page, 'Show negative in red.');
    await submitNumberFormat(page);
    await expect(page).toHaveURL(/numberFormat%5BshowInRed%5D=true/, {
      timeout: 15_000,
    });
    await expect(balance).toHaveCSS('color', NEGATIVE_RED_DARK, {
      timeout: 30_000,
    });
    await expect(credit).toHaveCSS('color', creditColour);
    expect(
      (await auditNegativeColours(page, 'trial-balance')).problems,
    ).toEqual([]);
  });

  for (const report of ROW_BEARING_REPORTS) {
    test(`should show only the negative amounts in red in the ${report.title} report.`, async ({
      page,
    }) => {
      await page.goto(withShowInRed(report.path));
      await waitForReportPage(page, report.title);
      await waitForReportRows(page, report.rowPrefix);

      // Passes without checking a colour when the report has no negative
      // amounts; the single-report tests above always have one.
      await expect
        .poll(
          async () =>
            (await auditNegativeColours(page, report.rowPrefix)).problems,
          { timeout: 30_000 },
        )
        .toEqual([]);
    });
  }
});
