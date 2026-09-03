import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Waits until the vendor credits list page is loaded.
 */
export async function waitForVendorCreditsList(page: Page) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    'Vendor Credits List',
    { timeout: 30_000 },
  );
  await expect(
    page.getByRole('button', { name: 'New Vendor Credit' }).first(),
  ).toBeVisible({ timeout: 30_000 });
}

/**
 * Waits until the vendor credit form page is loaded for the given title
 * (New Vendor Credit or Edit Vendor Credit).
 */
export async function waitForVendorCreditForm(page: Page, title: string) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    title,
    { timeout: 30_000 },
  );
  await expect(page.getByTestId('vendor-credit-vendor-select')).toBeVisible({
    timeout: 30_000,
  });
}

/**
 * Selects the given vendor inside the vendor credit form.
 *
 * The vendor Select popover cannot be opened reliably with a plain mouse
 * click, so it is retried the same way the invoice/estimate forms do: focus
 * the trigger, press Enter to open the popover, then immediately click the
 * matching menu item before the popover collapses.
 */
export async function selectVendor(page: Page, displayName: string) {
  const button = page.getByTestId('vendor-credit-vendor-select');

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
 * Once the item is selected the row is auto-filled with the price, unit
 * quantity and description, and a new empty line is appended. Waiting for the
 * second item input ensures the fetched values were committed before saving.
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
 * Creates a vendor credit through the UI as a draft and expects the redirect
 * back to the vendor credits list page. Returns the vendor credit number the
 * server assigned (read from the create request response, since the number
 * prefilled into the form can lag behind the server-assigned one).
 */
export async function createVendorCredit(
  page: Page,
  {
    vendorName,
    itemName,
    vendorCreditNumber,
  }: {
    vendorName: string;
    itemName: string;
    vendorCreditNumber?: string;
  },
): Promise<string> {
  await page.goto('/vendor-credits/new');
  await waitForVendorCreditForm(page, 'New Vendor Credit');

  await selectVendor(page, vendorName);
  await selectEntryItem(page, itemName);

  if (vendorCreditNumber) {
    await page
      .getByTestId('vendor-credit-number-input')
      .fill(vendorCreditNumber);
  }

  const createResponse = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === '/api/vendor-credits' &&
      response.request().method() === 'POST',
    { timeout: 20_000 },
  );

  await page.getByRole('button', { name: 'Save as Draft' }).click();

  const response = await createResponse;
  if (!response.ok()) {
    throw new Error(
      `[e2e] Creating the vendor credit failed with status ${response.status()}.`,
    );
  }
  const created = (await response.json()) as {
    vendorCreditNumber?: string;
    vendor_credit_number?: string;
  };
  const number = created.vendorCreditNumber ?? created.vendor_credit_number;
  if (!number) {
    throw new Error('[e2e] Creating the vendor credit returned no number.');
  }

  await waitForVendorCreditsList(page);

  return String(number);
}

/**
 * Filters the vendor credits table by the given vendor credit number and
 * returns the matching row locator. The number is unique per test, so the
 * filtered table holds a single row.
 */
export async function filterVendorCreditsByNumber(
  page: Page,
  vendorCreditNumber: string,
): Promise<Locator> {
  await page.getByRole('button', { name: /filter|filters applied/i }).click();
  await page.getByPlaceholder('Value').first().fill(vendorCreditNumber);

  const row = page
    .getByTestId('vendor-credit-row')
    .filter({ hasText: vendorCreditNumber })
    .first();
  await expect(row).toBeVisible({ timeout: 30_000 });

  // Close the filter popover before interacting with the table.
  await page.keyboard.press('Escape');

  return row;
}

/**
 * Deletes the given vendor credit row through the context menu and expects the
 * success toast.
 */
export async function deleteVendorCreditViaRow(page: Page, row: Locator) {
  await row.click({ button: 'right' });
  await page
    .getByRole('menuitem', { name: 'Delete Vendor Credit' })
    .click();

  await expect(page.getByTestId('vendor-credit-delete-alert')).toBeVisible();
  await page
    .getByRole('dialog')
    .filter({ has: page.getByTestId('vendor-credit-delete-alert') })
    .getByRole('button', { name: 'Delete' })
    .click();

  await expect(
    page.getByText('The given vendor credit has been deleted successfully'),
  ).toBeVisible({ timeout: 15_000 });
}
