import fs from 'fs';
import path from 'path';
import { test, expect, type Page } from '@playwright/test';
import {
  createCustomerViaApi,
  createDeliveredInvoiceViaApi,
  createExpenseViaApi,
  createItemViaApi,
  createManualJournalViaApi,
  createOpenedBillViaApi,
  createTaxRateViaApi,
  createVendorViaApi,
  fetchAccounts,
  findCustomerIdByName,
  findItemIdByName,
  findVendorIdByName,
  readApiAuth,
} from '../_api';

const API_BASE = process.env.PLAYWRIGHT_TEST_API_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.resolve(__dirname, '../../screenshots');

interface DemoItem {
  name: string;
  type: 'inventory' | 'non-inventory' | 'service';
  sellPrice: number;
  costPrice: number;
}

const CUSTOMERS = [
  'Acme Corporation',
  'Globex Corporation',
  'Initech',
  'Umbrella Corporation',
  'Stark Industries',
  'Wayne Enterprises',
];

const VENDORS = [
  'Northwind Traders',
  'Contoso Supplies',
  'Fabrikam Office',
  'Adventure Works',
  'Tailspin Toys',
];

const ITEMS: DemoItem[] = [
  {
    name: 'MacBook Pro 16"',
    type: 'inventory',
    sellPrice: 2499,
    costPrice: 2100,
  },
  {
    name: 'Ergonomic Office Chair',
    type: 'inventory',
    sellPrice: 349,
    costPrice: 210,
  },
  { name: '27" 4K Monitor', type: 'inventory', sellPrice: 549, costPrice: 410 },
  {
    name: 'Wireless Keyboard',
    type: 'non-inventory',
    sellPrice: 89,
    costPrice: 55,
  },
  {
    name: 'Annual Support Plan',
    type: 'service',
    sellPrice: 1200,
    costPrice: 0,
  },
  { name: 'Consulting Hour', type: 'service', sellPrice: 150, costPrice: 0 },
];

const EXPENSES = [
  {
    referenceNo: 'EXP-1001',
    amount: 8500,
    description: 'Office rent for the month',
    expenseAccountName: 'Rent',
    paymentAccountName: 'Bank Account',
  },
  {
    referenceNo: 'EXP-1002',
    amount: 1240,
    description: 'Office supplies and stationery',
    expenseAccountName: 'Office expenses',
    paymentAccountName: 'Bank Account',
  },
  {
    referenceNo: 'EXP-1003',
    amount: 320,
    description: 'Bank service charges',
    expenseAccountName: 'Bank Fees and Charges',
    paymentAccountName: 'Bank Account',
  },
  {
    referenceNo: 'EXP-1004',
    amount: 2100,
    description: 'Team offsite lunch',
    expenseAccountName: 'Office expenses',
    paymentAccountName: 'Petty Cash',
  },
  {
    referenceNo: 'EXP-1005',
    amount: 1200,
    description: 'Team software subscriptions',
    expenseAccountName: 'Office expenses',
    paymentAccountName: 'Saving Bank Account',
  },
];

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

async function seedDemoData() {
  const auth = readApiAuth();

  const taxRate = await createTaxRateViaApi(API_BASE, auth, {
    name: 'VAT 5%',
    code: 'VAT5',
    rate: 5,
  });

  // Fund the cash/bank accounts so the balance sheet and dashboard read
  // positive balances.
  const accounts = await fetchAccounts(API_BASE, auth);
  const accountId = (name: string) => {
    const account = accounts.find((item) => item.name === name);
    if (!account) {
      throw new Error(`[screenshots] Missing seed account "${name}".`);
    }
    return account.id;
  };
  await createManualJournalViaApi(API_BASE, auth, {
    date: daysAgo(150),
    journalNumber: 'MJ-1001',
    referenceNo: 'OB-1001',
    description: 'Opening balances',
    entries: [
      {
        accountId: accountId('Bank Account'),
        debit: 250_000,
        note: 'Opening bank balance',
      },
      {
        accountId: accountId('Petty Cash'),
        debit: 20_000,
        note: 'Opening petty cash balance',
      },
      {
        accountId: accountId('Saving Bank Account'),
        debit: 50_000,
        note: 'Opening savings balance',
      },
      {
        accountId: accountId('Opening Balance Equity'),
        credit: 320_000,
        note: 'Opening balance equity',
      },
    ],
  });

  const itemIds: number[] = [];
  for (const item of ITEMS) {
    const created = await createItemViaApi(API_BASE, auth, item);
    itemIds.push(
      created?.id ?? (await findItemIdByName(API_BASE, auth, item.name)),
    );
  }

  const customerIds: number[] = [];
  for (const displayName of CUSTOMERS) {
    const created = await createCustomerViaApi(API_BASE, auth, { displayName });
    customerIds.push(
      created?.id ??
        (await findCustomerIdByName(API_BASE, auth, displayName)),
    );
  }

  const vendorIds: number[] = [];
  for (const displayName of VENDORS) {
    const created = await createVendorViaApi(API_BASE, auth, { displayName });
    vendorIds.push(
      created?.id ?? (await findVendorIdByName(API_BASE, auth, displayName)),
    );
  }

  for (let index = 0; index < 14; index++) {
    const item = ITEMS[index % ITEMS.length];
    const invoiceDaysAgo = 6 + index * 6;
    await createDeliveredInvoiceViaApi(API_BASE, auth, {
      customerId: customerIds[index % customerIds.length],
      itemId: itemIds[index % itemIds.length],
      rate: item.sellPrice,
      quantity: 2 + (index % 3),
      date: daysAgo(invoiceDaysAgo),
      dueDate: daysAgo(invoiceDaysAgo - 30),
      taxRateId: taxRate?.id,
    });
  }

  const purchaseItems = ITEMS.filter((item) => item.type === 'inventory');
  for (let index = 0; index < 6; index++) {
    const item = purchaseItems[index % purchaseItems.length];
    const itemId = itemIds[ITEMS.indexOf(item)];
    await createOpenedBillViaApi(API_BASE, auth, {
      vendorId: vendorIds[index % vendorIds.length],
      itemId,
      rate: item.costPrice,
      quantity: 8 + (index % 4),
      date: daysAgo(10 + index * 12),
      billNumber: `BILL-${1001 + index}`,
      referenceNo: `REF-${1001 + index}`,
      description: `${item.name} purchase`,
    });
  }

  for (let index = 0; index < EXPENSES.length; index++) {
    await createExpenseViaApi(API_BASE, auth, {
      ...EXPENSES[index],
      paymentDate: daysAgo(8 + index * 14),
    });
  }
}

async function openPage(page: Page, route: string, title?: string) {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('dashboard-topbar')).toBeVisible({
    timeout: 60_000,
  });
  if (title) {
    await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
      title,
      { timeout: 30_000 },
    );
  }
  // The webapp hardcodes `bp4-dark` on <body> and only toggles the class when
  // the user switches themes. Force the dark theme so captures are consistent.
  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('bp4-dark');
    document.body.classList.add('bp4-dark');
  });
  await page.addStyleTag({
    content:
      '*, *::before, *::after { transition: none !important; animation: none !important; }',
  });
}

async function capture(
  page: Page,
  route: string,
  file: string,
  options: {
    title?: string;
    rowSelector?: string;
    rowTestId?: string | RegExp;
    settleMs?: number;
  } = {},
) {
  await openPage(page, route, options.title);
  if (options.rowTestId) {
    await expect(page.getByTestId(options.rowTestId).first()).toBeVisible({
      timeout: 30_000,
    });
  } else if (options.rowSelector) {
    await expect(page.locator(options.rowSelector).first()).toBeVisible({
      timeout: 30_000,
    });
  }
  await page
    .waitForLoadState('networkidle', { timeout: 5_000 })
    .catch(() => undefined);
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForTimeout(options.settleMs ?? 750);
  await page.screenshot({ path: path.join(OUTPUT_DIR, file) });
}

test.describe('app screenshots', () => {
  test.beforeAll(async () => {
    test.setTimeout(15 * 60_000);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    await seedDemoData();
  });

  test('captures the dashboard', async ({ page }) => {
    await capture(page, '/', 'dashboard.png', {
      rowSelector: '.financial-reports__item',
    });
  });

  test('captures the invoices list', async ({ page }) => {
    await capture(page, '/invoices', 'invoices.png', {
      title: 'Invoices List',
      rowSelector: '.tbody .tr',
    });
  });

  test('captures the bills list', async ({ page }) => {
    await capture(page, '/bills', 'bills.png', {
      title: 'Bills List',
      rowSelector: '.tbody .tr',
    });
  });

  test('captures the customers list', async ({ page }) => {
    await capture(page, '/customers', 'customers.png', {
      title: 'Customers List',
      rowSelector: '.tbody .tr',
    });
  });

  test('captures the vendors list', async ({ page }) => {
    await capture(page, '/vendors', 'vendors.png', {
      title: 'Vendors List',
      rowSelector: '.tbody .tr',
    });
  });

  test('captures the items list', async ({ page }) => {
    await capture(page, '/items', 'items.png', {
      title: 'Items List',
      rowSelector: '.tbody .tr',
    });
  });

  test('captures the expenses list', async ({ page }) => {
    await capture(page, '/expenses', 'expenses.png', {
      title: 'Expenses List',
      rowSelector: '.tbody .tr',
    });
  });

  test('captures the profit and loss sheet', async ({ page }) => {
    await capture(
      page,
      '/financial-reports/profit-loss-sheet',
      'profit-loss.png',
      {
        title: 'Profit/Loss Sheet',
        rowTestId: /^profit-loss-row--/,
      },
    );
  });

  test('captures the balance sheet', async ({ page }) => {
    await capture(page, '/financial-reports/balance-sheet', 'balance-sheet.png', {
      title: 'Balance Sheet',
      rowTestId: /^balance-sheet-row--/,
    });
  });
});
