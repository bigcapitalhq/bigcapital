import { expect, test } from '@playwright/test';
import { selectEntryItem } from './_invoices';

for (const form of ['invoice', 'bill']) {
  test(`creates a service from a new ${form} line`, async ({ page }) => {
    const name = `E2E ${form} service ${Date.now()}`;
    await page.goto(`/${form}s/new`);
    const input = page.getByPlaceholder('Enter an item...').first();
    await input.pressSequentially(name);
    await page.getByRole('menuitem', { name: `Create "${name}"` }).click();

    const drawer = page.locator('.drawer-portal');
    await expect(drawer.locator('input[name="name"]')).toHaveValue(name);

    for (const [section, price, account] of [
      ['selling', 'sellPrice', 'Sales of Product Income'],
      ['purchasing', 'costPrice', 'Cost of Goods Sold'],
    ]) {
      const fields = drawer.locator(`[data-section-id="${section}"]`);
      await fields.locator(`input[name="${price}"]`).fill('10');
      await fields.getByRole('button', { name: 'Select Account' }).click();
      await page.getByRole('menuitem', { name: account }).click();
    }
    await drawer.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(drawer).toBeHidden();
    await selectEntryItem(page, name);
  });
}
