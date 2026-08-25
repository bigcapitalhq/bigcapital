import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Waits until the estimates list page is loaded.
 */
export async function waitForEstimatesList(page: Page) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    'Estimates List',
    { timeout: 30_000 },
  );
  await expect(
    page.getByRole('button', { name: 'New Estimate' }).first(),
  ).toBeVisible({ timeout: 30_000 });
}

/**
 * Waits until the estimate form page is loaded for the given title
 * (New Estimate or Edit Estimate).
 */
export async function waitForEstimateForm(page: Page, title: string) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    title,
    { timeout: 30_000 },
  );
  await expect(page.getByTestId('estimate-customer-select')).toBeVisible({
    timeout: 30_000,
  });
}

/**
 * Selects the given customer inside the estimate form.
 *
 * The customer Select popover cannot be opened reliably with a plain mouse
 * click, so it is retried the same way the account type select does: focus
 * the trigger, press Enter to open the popover, then immediately click the
 * matching menu item before the popover collapses.
 */
export async function selectCustomer(page: Page, displayName: string) {
  const button = page.getByTestId('estimate-customer-select');

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
  throw new Error(`Failed to select the "${displayName}" customer.`);
}

/**
 * Selects the given item inside the first entries table row.
 *
 * Once the item is selected the row is auto-filled with the sell price, unit
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
 * Creates an estimate through the UI as a draft and expects the success toast
 * alongside the redirect back to the estimates list page. Returns the estimate
 * number the server assigned to the created estimate (read from the create
 * request response, since the number prefilled into the form can lag behind
 * the server-assigned one).
 */
export async function createEstimate(
  page: Page,
  {
    customerName,
    itemName,
    estimateNumber,
  }: {
    customerName: string;
    itemName: string;
    estimateNumber?: string;
  },
): Promise<string> {
  await page.goto('/estimates/new');
  await waitForEstimateForm(page, 'New Estimate');

  await selectCustomer(page, customerName);
  await selectEntryItem(page, itemName);

  if (estimateNumber) {
    await page.getByTestId('estimate-number-input').fill(estimateNumber);
  }

  const createResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/sale-estimates') &&
      response.request().method() === 'POST',
    { timeout: 20_000 },
  );

  await page.getByRole('button', { name: 'Save as Draft' }).click();

  const response = await createResponse;
  if (!response.ok()) {
    throw new Error(
      `[e2e] Creating the estimate failed with status ${response.status()}.`,
    );
  }
  const createdEstimate = (await response.json()) as {
    estimateNumber?: string;
    estimate_number?: string;
  };
  const number =
    createdEstimate.estimateNumber ?? createdEstimate.estimate_number;
  if (!number) {
    throw new Error('[e2e] Creating the estimate returned no estimate number.');
  }

  await waitForEstimatesList(page);

  return String(number);
}

/**
 * Filters the estimates table by the given estimate number and returns the
 * matching row locator. The estimate number is unique per test, so the
 * filtered table holds a single row.
 */
export async function filterEstimatesByNumber(
  page: Page,
  estimateNumber: string,
): Promise<Locator> {
  await page.getByRole('button', { name: /filter|filters applied/i }).click();
  await page.getByPlaceholder('Value').first().fill(estimateNumber);

  const row = page
    .getByTestId('estimate-row')
    .filter({ hasText: estimateNumber })
    .first();
  await expect(row).toBeVisible({ timeout: 30_000 });

  // Close the filter popover before interacting with the table.
  await page.keyboard.press('Escape');

  return row;
}

/**
 * Deletes the given estimate row through the context menu and expects the
 * success toast.
 */
export async function deleteEstimateViaRow(page: Page, row: Locator) {
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Delete Estimate' }).click();

  await expect(page.getByTestId('estimate-delete-alert')).toBeVisible();
  await page
    .getByRole('dialog')
    .filter({ has: page.getByTestId('estimate-delete-alert') })
    .getByRole('button', { name: 'Delete' })
    .click();

  await expect(
    page.getByText('The estimate has been deleted successfully.'),
  ).toBeVisible({ timeout: 15_000 });
}
