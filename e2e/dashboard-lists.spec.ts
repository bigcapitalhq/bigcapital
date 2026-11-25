import { expect, test } from '@playwright/test';

const lists = [
  {
    path: '/bills',
    endpoint: '/api/bills',
    rowTestId: 'bill-row',
    identifier: 'bill_number',
    fields: { due_date: '2026-02-10', is_open: false },
    cell: 'Draft',
  },
  {
    path: '/payments-made',
    endpoint: '/api/bill-payments',
    rowTestId: 'payment-made-row',
    identifier: 'payment_number',
    fields: { payment_account: { name: 'Checking' }, amount: 42 },
    cell: 'Checking',
  },
  {
    path: '/vendor-credits',
    endpoint: '/api/vendor-credits',
    rowTestId: 'vendor-credit-row',
    identifier: 'vendor_credit_number',
    fields: {
      formatted_credits_remaining: '$42.25',
      formatted_credits_remaining_amount: '$42.25',
      is_draft: true,
    },
    cell: '$42.25',
  },
  {
    path: '/manual-journals',
    endpoint: '/api/manual-journals',
    rowTestId: 'manual-journal-row',
    identifier: 'journal_number',
    fields: { journal_type: 'Accrual', entries: [] },
    cell: 'Accrual',
  },
  {
    path: '/recurring-journals',
    endpoint: '/api/recurring-journals',
    feature: 'recurring_journals',
    rowTestId: 'recurring-journal-row',
    identifier: 'profile_name',
    fields: {
      frequency: 'month',
      repeat_interval: 1,
      status: 'paused',
      failure_count: 2,
    },
    cell: 'Needs attention',
  },
  {
    path: '/expenses',
    endpoint: '/api/expenses',
    rowTestId: 'expense-row',
    identifier: 'formatted_date',
    fields: { formatted_amount: '$42.25', categories: [] },
    cell: '$42.25',
  },
  {
    path: '/customers',
    endpoint: '/api/customers',
    rowTestId: 'customer-row',
    identifier: 'display_name',
    fields: { company_name: 'Example company' },
    cell: 'Example company',
  },
  {
    path: '/vendors',
    endpoint: '/api/vendors',
    rowTestId: 'vendor-row',
    identifier: 'display_name',
    fields: { company_name: 'Example company' },
    cell: 'Example company',
  },
  {
    path: '/items',
    endpoint: '/api/items',
    rowTestId: 'item-row',
    identifier: 'name',
    fields: { quantity_on_hand: 3, reorder_point: 5 },
    cell: '3',
  },
  {
    path: '/inventory-adjustments',
    endpoint: '/api/inventory-adjustments',
    rowTestId: 'inventory-adjustment-row',
    identifier: 'reference_no',
    fields: { date: '2026-01-01', reason: 'Stock count' },
    cell: 'Stock count',
  },
];
for (const list of lists) {
  test(`${list.path} keeps record selection and actions on the correct page`, async ({
    page,
  }) => {
    const records = Array.from({ length: 21 }, (_, index) => ({
      id: index + 101,
      [list.identifier]: `Record ${index + 1}`,
      currency_code: 'USD',
      ...list.fields,
    }));
    if (list.feature) {
      await page.route('**/api/dashboard/boot', async (route) => {
        const response = await route.fetch();
        const boot = await response.json();
        await route.fulfill({
          response,
          json: {
            ...boot,
            features: boot.features.map((feature: { name: string }) =>
              feature.name === list.feature
                ? { ...feature, is_accessible: true }
                : feature,
            ),
          },
        });
      });
    }
    await page.route(
      (url) => url.pathname === list.endpoint,
      (route) => {
        const params = new URL(route.request().url()).searchParams;
        const size = Number(params.get('page_size'));
        const start = (Number(params.get('page')) - 1) * size;
        return route.fulfill({
          json: {
            data: records.slice(start, start + size),
            pagination: { total: records.length },
          },
        });
      },
    );
    await page.goto(list.path);

    const first = page.getByTestId(list.rowTestId).first();
    const checkbox = page.getByRole('checkbox', {
      name: 'Select row 1',
      exact: true,
    });
    await expect(first).toHaveText('Record 1', { timeout: 30_000 });
    await checkbox.press('Space');
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(first).toHaveText('Record 21');
    await expect(checkbox).not.toBeChecked();
    await expect(
      page
        .locator('.dashboard__datatable')
        .getByText(list.cell, { exact: true }),
    ).toBeVisible();

    await first.click({ button: 'right' });
    await expect(
      page.getByRole('menuitem', { name: /view details/i }),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Previous page' }).click();
    await expect(first).toHaveText('Record 1');
    await expect(checkbox).toBeChecked();
  });
}

test('items copy selected cells in spreadsheet order', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.route(
    (url) => url.pathname === '/api/items',
    (route) => route.fulfill({
      json: {
        data: [
          { id: 1, name: 'Pen', code: 'P01' },
          { id: 2, name: 'Notebook', code: 'N02' },
        ],
        pagination: { total: 2 },
      },
    }),
  );
  await page.goto('/items');
  const first = page.getByTestId('item-row').first();
  await expect(first).toHaveText('Pen', { timeout: 30_000 });
  const last = page.locator('.dashboard__datatable').getByText('N02', { exact: true });
  await first.dragTo(last);
  await page.keyboard.press('ControlOrMeta+c');
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe('Pen\tP01\nNotebook\tN02');
});

test('tax rates sort by numeric rate and keep the status action with the record', async ({
  page,
}) => {
  await page.route(
    (url) => url.pathname === '/api/tax-rates',
    (route) =>
      route.fulfill({
        json: [
          {
            id: 1,
            name: 'Standard',
            rate: 20,
            rate_formatted: '20%',
            active: true,
          },
          {
            id: 2,
            name: 'Reduced',
            rate: 5,
            rate_formatted: '5%',
            active: false,
          },
        ],
      }),
  );
  await page.goto('/tax-rates');
  const header = page.getByTitle('Rate', { exact: true });
  await header.hover();
  await header.locator('[data-icon="chevron-down"]').click();
  await page.getByRole('menuitem', { name: 'Sort Asc' }).click();
  const first = page.getByTestId('tax-rate-row').first();
  await expect(first).toHaveText('Reduced');
  await first.click({ button: 'right' });
  await expect(
    page.getByRole('menuitem', { name: 'Activate Tax Rate', exact: true }),
  ).toBeVisible();
});

test('item category selection follows its ID after sorting', async ({
  page,
}) => {
  await page.route(
    (url) => url.pathname === '/api/item-categories',
    (route) =>
      route.fulfill({
        json: [
          { id: 1, name: 'Tools', count: 5 },
          { id: 2, name: 'Parts', count: 2 },
        ],
      }),
  );
  await page.goto('/items/categories');
  const first = page.getByTestId('category-row').first();
  await expect(first).toHaveText('Tools');
  await page
    .getByRole('checkbox', { name: 'Select row 1', exact: true })
    .press('Space');
  const header = page.getByTitle('Count', { exact: true });
  await header.hover();
  await header.locator('[data-icon="chevron-down"]').click();
  await page.getByRole('menuitem', { name: 'Sort Asc' }).click();
  await expect(first).toHaveText('Parts');
  await expect(
    page.getByRole('checkbox', { name: 'Select row 2', exact: true }),
  ).toBeChecked();
});
