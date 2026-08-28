import { test, expect, type Locator, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

/**
 * Generates a unique contact name pair (first + last) alongside the display
 * name that the form derives from them (`{first} {last}`).
 */
function contactName() {
  const firstName = faker.person.firstName();
  const lastName = `${faker.person.lastName()} ${faker.string.alphanumeric(4)}`;
  return {
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
  };
}

const companyName = () => `${faker.company.name()} ${faker.string.alphanumeric(4)}`;

/**
 * Waits until the vendors list page is loaded.
 */
async function waitForVendorsList(page: Page) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    'Vendors List',
    { timeout: 30_000 },
  );
  await expect(
    page.getByRole('button', { name: 'New Vendor' }).first(),
  ).toBeVisible({ timeout: 30_000 });
}

/**
 * Waits until the vendor form page is loaded for the given title
 * (New Vendor or Edit Vendor).
 */
async function waitForVendorForm(page: Page, title: string) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    title,
    { timeout: 30_000 },
  );
  await expect(page.getByTestId('vendor-first-name-input')).toBeVisible({
    timeout: 30_000,
  });
}

/**
 * Selects the display name inside the vendor form.
 *
 * The display name Select popover cannot be opened reliably with a plain mouse
 * click, so it is retried the same way the account type select does: focus the
 * trigger, press Enter to open the popover, then immediately click the matching
 * menu item before the popover collapses.
 */
async function selectDisplayName(
  page: Page,
  selector: string,
  displayName: string,
) {
  const button = page.getByTestId(selector);

  for (let attempt = 0; attempt < 8; attempt++) {
    await button.focus();
    await page.keyboard.press('Enter');

    const clicked = await page.evaluate((name) => {
      const items = Array.from(
        document.querySelectorAll('[role="menuitem"]'),
      );
      const item = items.find(
        (el) => (el as HTMLElement).innerText.trim() === name,
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
  throw new Error(`Failed to select the "${displayName}" display name.`);
}

/**
 * Creates a vendor through the UI and expects the success toast alongside
 * the redirect back to the vendors list page.
 */
async function createVendor(
  page: Page,
  {
    firstName,
    lastName,
    companyName: vendorCompanyName,
  }: {
    firstName: string;
    lastName: string;
    companyName: string;
  },
) {
  await page.goto('/vendors/new');
  await waitForVendorForm(page, 'New Vendor');

  await page.getByTestId('vendor-first-name-input').fill(firstName);
  await page.getByTestId('vendor-last-name-input').fill(lastName);
  await page.getByTestId('vendor-company-name-input').fill(vendorCompanyName);

  await selectDisplayName(
    page,
    'vendor-display-name-select',
    `${firstName} ${lastName}`,
  );

  await page.getByRole('button', { name: 'Save', exact: true }).click();

  await expect(
    page.getByText('The vendor has been successfully created.'),
  ).toBeVisible({ timeout: 15_000 });

  await waitForVendorsList(page);
}

/**
 * Filters the vendors table by the given display name and returns the
 * matching row locator.
 */
async function filterVendorsBy(page: Page, displayName: string) {
  await page.getByRole('button', { name: /filter|filters applied/i }).click();
  await page.getByPlaceholder('Value').first().fill(displayName);

  const row = page
    .getByTestId('vendor-row')
    .filter({ hasText: displayName })
    .first();
  await expect(row).toBeVisible({ timeout: 30_000 });

  // Close the filter popover before interacting with the table.
  await page.keyboard.press('Escape');

  return row;
}

/**
 * Deletes the given vendor row through the context menu and expects the
 * success toast.
 */
async function deleteVendorViaRow(page: Page, row: Locator) {
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Delete Vendor' }).click();

  await expect(page.getByTestId('vendor-delete-alert')).toBeVisible();
  await page
    .getByRole('dialog')
    .filter({ has: page.getByTestId('vendor-delete-alert') })
    .getByRole('button', { name: 'Delete' })
    .click();

  await expect(
    page.getByText('The vendor has been deleted successfully.'),
  ).toBeVisible({ timeout: 15_000 });
}

test.describe('vendors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vendors');
  });

  test('should show the vendors page.', async ({ page }) => {
    await waitForVendorsList(page);

    await expect(
      page.getByRole('button', { name: 'New Vendor' }).first(),
    ).toBeVisible();
  });

  test('should create a vendor successfully.', async ({ page }) => {
    await waitForVendorsList(page);

    const { firstName, lastName, displayName } = contactName();
    await createVendor(page, {
      firstName,
      lastName,
      companyName: companyName(),
    });

    await filterVendorsBy(page, displayName);
  });

  test('should edit a vendor successfully.', async ({ page }) => {
    await waitForVendorsList(page);

    const { firstName, lastName, displayName } = contactName();
    const newCompanyName = companyName();

    await createVendor(page, {
      firstName,
      lastName,
      companyName: companyName(),
    });

    const row = await filterVendorsBy(page, displayName);
    await row.click({ button: 'right' });
    await page.getByRole('menuitem', { name: 'Edit Vendor' }).click();

    await waitForVendorForm(page, 'Edit Vendor');
    await expect(
      page.getByTestId('vendor-display-name-select'),
    ).toContainText(displayName, { timeout: 30_000 });

    await page.getByTestId('vendor-company-name-input').fill(newCompanyName);
    await page.getByRole('button', { name: 'Edit', exact: true }).click();

    await expect(
      page.getByText('The item vendor has been edited successfully.'),
    ).toBeVisible({ timeout: 15_000 });

    await waitForVendorsList(page);

    const editedRow = await filterVendorsBy(page, displayName);
    await expect(editedRow).toContainText(newCompanyName, {
      timeout: 15_000,
    });
  });

  test('should delete a vendor successfully.', async ({ page }) => {
    await waitForVendorsList(page);

    const { firstName, lastName, displayName } = contactName();
    await createVendor(page, {
      firstName,
      lastName,
      companyName: companyName(),
    });

    const row = await filterVendorsBy(page, displayName);
    await deleteVendorViaRow(page, row);

    await expect(page.getByTestId('vendor-row')).toHaveCount(0, {
      timeout: 15_000,
    });
  });
});
