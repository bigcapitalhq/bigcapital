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
