import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Waits until the bills list page is loaded.
 */
export async function waitForBillsList(page: Page) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    'Bills List',
    { timeout: 30_000 },
  );
  await expect(
    page.getByRole('button', { name: 'New Bill' }).first(),
  ).toBeVisible({ timeout: 30_000 });
}

/**
 * Waits until the bill form page is loaded for the given title
 * (New Bill or Edit Bill).
 */
export async function waitForBillForm(page: Page, title: string) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    title,
    { timeout: 30_000 },
  );
  await expect(page.getByTestId('bill-vendor-select')).toBeVisible({
    timeout: 30_000,
  });
}

/**
 * Selects the given vendor inside the bill form.
 *
 * The vendor Select popover cannot be opened reliably with a plain mouse
 * click, so it is retried the same way the customer select does: focus the
 * trigger, press Enter to open the popover, then immediately click the
 * matching menu item before the popover collapses.
 */
export async function selectVendor(page: Page, displayName: string) {
  const button = page.getByTestId('bill-vendor-select');

  for (let attempt = 0; attempt < 8; attempt++) {
    await button.focus();
    await page.keyboard.press('Enter');

    const clicked = await page.evaluate((name) => {
      const items = Array.from(document.querySelectorAll('[role="menuitem"]'));
      const item = items.find((el) =>
        (el as HTMLElement).innerText.trim().includes(name),
      );
      if (item) {
        (item as HTMLElement).click();
        return true;
      }
      return false;
    }, displayName);

    if (clicked) {
      await expect(button).toContainText(displayName, { timeout: 5_000 });
      return;
    }
    await page.keyboard.press('Escape');
  }
  throw new Error(`Failed to select the "${displayName}" vendor.`);
}

/**
 * Selects the given item inside the first entries table row.
 *
 * Once the item is selected the row is auto-filled with the purchase price,
 * unit quantity and description, and a new empty line is appended. Waiting
 * for the second item input ensures the fetched values were committed before
 * saving.
 */
export async function selectEntryItem(page: Page, itemName: string) {
  const input = page.getByPlaceholder('Enter an item...').first();
  await input.click();
  await input.pressSequentially(itemName);

  // The item suggestion popover opens asynchronously after typing and can
  // re-render its menu items while waiting, so the click scans the live DOM
  // in a polling loop instead of holding a possibly-stale locator.
  let clicked = false;
  for (let attempt = 0; attempt < 12 && !clicked; attempt++) {
    clicked = await page.evaluate((name) => {
      const items = Array.from(document.querySelectorAll('[role="menuitem"]'));
      const item = items.find((el) =>
        (el as HTMLElement).innerText.trim().includes(name),
      );
      if (item) {
        (item as HTMLElement).click();
        return true;
      }
      return false;
    }, itemName);

    if (!clicked) {
      await page.waitForTimeout(250);
    }
  }

  if (!clicked) {
    throw new Error(`Failed to select the "${itemName}" item.`);
  }

  await expect(page.getByPlaceholder('Enter an item...')).toHaveCount(2, {
    timeout: 10_000,
  });

  // Close any lingering select popover before interacting with the footer.
  await page.keyboard.press('Escape');
}

/**
 * Creates a bill through the UI as a draft and expects the redirect back to
 * the bills list page. The bill number is filled explicitly (bills are not
 * auto-numbered by default), so the returned value is the one that was set.
 */
export async function createBill(
  page: Page,
  {
    vendorName,
    itemName,
    billNumber,
  }: {
    vendorName: string;
    itemName: string;
    billNumber?: string;
  },
): Promise<string> {
  await page.goto('/bills/new');
  await waitForBillForm(page, 'New Bill');

  await selectVendor(page, vendorName);
  await selectEntryItem(page, itemName);

  const number =
    billNumber ??
    `BILL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  await page.getByTestId('bill-number-input').fill(number);

  await page.getByRole('button', { name: 'Save as Draft' }).click();

  // A successful save redirects back to the bills list page.
  await waitForBillsList(page);

  return String(number);
}

/**
 * Filters the bills table by the given bill number and returns the matching
 * row locator. The bill number is unique per test, so the filtered table
 * holds a single row.
 */
export async function filterBillsByNumber(
  page: Page,
  billNumber: string,
): Promise<Locator> {
  await page.getByRole('button', { name: /filter|filters applied/i }).click();
  await page.getByPlaceholder('Value').first().fill(billNumber);

  const row = page
    .getByTestId('bill-row')
    .filter({ hasText: billNumber })
    .first();
  await expect(row).toBeVisible({ timeout: 30_000 });

  // Close the filter popover before interacting with the table.
  await page.keyboard.press('Escape');

  return row;
}

/**
 * Deletes the given bill row through the context menu and expects the success
 * toast.
 */
export async function deleteBillViaRow(page: Page, row: Locator) {
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Delete Bill' }).click();

  await expect(page.getByTestId('bill-delete-alert')).toBeVisible();
  await page
    .getByRole('dialog')
    .filter({ has: page.getByTestId('bill-delete-alert') })
    .getByRole('button', { name: 'Delete' })
    .click();

  await expect(
    page.getByText('The bill has been deleted successfully.'),
  ).toBeVisible({ timeout: 15_000 });
}
