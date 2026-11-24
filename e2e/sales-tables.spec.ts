import { expect, test } from '@playwright/test';

const lists = [
  {
    path: '/estimates',
    endpoint: '/api/sale-estimates',
    rowTestId: 'estimate-row',
    identifier: 'estimate_number',
    fields: {
      expiration_date: '2026-02-10',
      amount: 42,
      is_delivered: true,
      is_approved: true,
    },
    cell: 'Approved',
    menuItem: 'Convert to Invoice',
  },
  {
    path: '/recurring-invoices',
    endpoint: '/api/recurring-invoices',
    rowTestId: 'recurring-invoice-row',
    identifier: 'profile_name',
    fields: {
      frequency: 'month',
      repeat_interval: 1,
      status: 'paused',
      failure_count: 2,
    },
    cell: 'Needs attention',
    menuItem: 'Resume',
  },
  {
    path: '/receipts',
    endpoint: '/api/sale-receipts',
    rowTestId: 'receipt-row',
    identifier: 'receipt_number',
    fields: { total: 42, is_closed: false },
    cell: 'Draft',
    menuItem: 'Mark as closed',
  },
  {
    path: '/credit-notes',
    endpoint: '/api/credit-notes',
    rowTestId: 'credit-note-row',
    identifier: 'credit_note_number',
    fields: {
      formatted_credits_remaining: '$42.25',
      formatted_credits_remaining_amount: '$42.25',
      is_draft: true,
    },
    cell: '$42.25',
    menuItem: 'Mark as Open',
  },
  {
    path: '/payments-received',
    endpoint: '/api/payments-received',
    rowTestId: 'payment-received-row',
    identifier: 'payment_receive_no',
    fields: { deposit_account: { name: 'Operating bank' }, amount: 42 },
    cell: 'Operating bank',
    menuItem: 'Edit Payment Received',
  },
];

for (const list of lists) {
  test(`${list.path} keeps selection, document cells and actions tied to the server page`, async ({
    page,
  }) => {
    const documents = Array.from({ length: 21 }, (_, index) => ({
      id: 101 + index,
      [list.identifier]: `DOC-${index + 1}`,
      currency_code: 'USD',
      ...list.fields,
    }));
    await page.route(
      (url) => url.pathname === list.endpoint,
      (route) => {
        const query = new URL(route.request().url()).searchParams;
        const size = Number(query.get('page_size'));
        const start = (Number(query.get('page')) - 1) * size;
        return route.fulfill({
          json: {
            data: documents.slice(start, start + size),
            pagination: { total: documents.length },
          },
        });
      },
    );
    await page.goto(list.path);

    const document = page.getByTestId(list.rowTestId).first();
    const checkbox = page.getByRole('checkbox', {
      name: 'Select row 1',
      exact: true,
    });
    await expect(document).toHaveText('DOC-1', { timeout: 30_000 });
    await checkbox.press('Space');
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(document).toHaveText('DOC-21');
    await expect(checkbox).not.toBeChecked();

    await expect(
      page
        .locator('.dashboard__datatable')
        .getByText(list.cell, { exact: true }),
    ).toBeVisible();
    await document.click({ button: 'right' });
    await expect(
      page.getByRole('menuitem', { name: list.menuItem, exact: true }),
    ).toBeVisible();
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Previous page' }).click();
    await expect(document).toHaveText('DOC-1');
    await expect(checkbox).toBeChecked();
  });
}
