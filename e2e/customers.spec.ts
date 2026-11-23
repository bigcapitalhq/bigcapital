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
 * Waits until the customers list page is loaded.
 */
async function waitForCustomersList(page: Page) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    'Customers',
    { timeout: 30_000 },
  );
  await expect(
    page.getByRole('button', { name: 'New Customer' }).first(),
  ).toBeVisible({ timeout: 30_000 });
}

/**
 * Waits until the customer form page is loaded for the given title
 * (New Customer or Edit Customer).
 */
async function waitForCustomerForm(page: Page, title: string) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    title,
    { timeout: 30_000 },
  );
  await expect(page.getByTestId('customer-first-name-input')).toBeVisible({
    timeout: 30_000,
  });
}

/**
 * Selects the display name inside the customer form.
 */
async function selectDisplayName(
  page: Page,
  selector: string,
  displayName: string,
) {
  const button = page.getByTestId(selector);

  await button.click();
  await page.getByRole('menuitem', { name: displayName, exact: true }).first().click();
  await expect(button).toContainText(displayName);
}

/**
 * Creates a customer through the UI and expects the success toast alongside
 * the redirect back to the customers list page.
 */
async function createCustomer(
  page: Page,
  {
    firstName,
    lastName,
    companyName: customerCompanyName,
  }: {
    firstName: string;
    lastName: string;
    companyName: string;
  },
) {
  await page.goto('/customers/new');
  await waitForCustomerForm(page, 'New Customer');

  await page.getByTestId('customer-first-name-input').fill(firstName);
  await page.getByTestId('customer-last-name-input').fill(lastName);
  await page.getByTestId('customer-company-name-input').fill(customerCompanyName);

  await selectDisplayName(
    page,
    'customer-display-name-select',
    `${firstName} ${lastName}`,
  );

  await page.getByRole('button', { name: 'Save', exact: true }).click();

  await expect(
    page.getByText('The customer has been created successfully.'),
  ).toBeVisible({ timeout: 15_000 });

  await waitForCustomersList(page);
}

/**
 * Filters the customers table by the given display name and returns the
 * matching row locator.
 */
async function filterCustomersBy(page: Page, displayName: string) {
  await page.getByRole('button', { name: /filter|filters applied/i }).click();
  await Promise.all([
    page.waitForResponse((response) => {
      const url = new URL(response.url());
      return (
        url.pathname === '/api/customers' &&
        !!url.searchParams
          .get('stringified_filter_roles')
          ?.includes(displayName) &&
        response.ok()
      );
    }),
    page.getByPlaceholder('Value').first().fill(displayName),
  ]);

  const row = page
    .getByTestId('customer-row')
    .filter({ hasText: displayName })
    .first();
  await expect(row).toBeVisible({ timeout: 30_000 });

  // Close the filter popover before interacting with the table.
  await page.keyboard.press('Escape');

  return row;
}

/**
 * Deletes the given customer row through the context menu and expects the
 * success toast.
 */
async function deleteCustomerViaRow(page: Page, row: Locator) {
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Delete Customer' }).click();

  await expect(page.getByTestId('customer-delete-alert')).toBeVisible();
  await page
    .getByRole('alertdialog')
    .filter({ has: page.getByTestId('customer-delete-alert') })
    .getByRole('button', { name: 'Delete' })
    .click();

  await expect(
    page.getByText('The customer has been deleted successfully.'),
  ).toBeVisible({ timeout: 15_000 });
}

test.describe('customers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/customers');
  });

  test('should show the customers page.', async ({ page }) => {
    await waitForCustomersList(page);

    await expect(
      page.getByRole('button', { name: 'New Customer' }).first(),
    ).toBeVisible();
  });

  test('should create a customer successfully.', async ({ page }) => {
    await waitForCustomersList(page);

    const { firstName, lastName, displayName } = contactName();
    await createCustomer(page, {
      firstName,
      lastName,
      companyName: companyName(),
    });

    await filterCustomersBy(page, displayName);
  });

  test('should edit a customer successfully.', async ({ page }) => {
    await waitForCustomersList(page);

    const { firstName, lastName, displayName } = contactName();
    const newCompanyName = companyName();

    await createCustomer(page, {
      firstName,
      lastName,
      companyName: companyName(),
    });

    const row = await filterCustomersBy(page, displayName);
    await row.click({ button: 'right' });
    await page.getByRole('menuitem', { name: 'Edit Customer' }).click();

    await waitForCustomerForm(page, 'Edit Customer');
    await expect(
      page.getByTestId('customer-display-name-select'),
    ).toContainText(displayName, { timeout: 30_000 });

    await page.getByTestId('customer-company-name-input').fill(newCompanyName);
    await page.getByRole('button', { name: 'Edit', exact: true }).click();

    await expect(
      page.getByText('The item customer has been edited successfully.'),
    ).toBeVisible({ timeout: 15_000 });

    await waitForCustomersList(page);

    const editedRow = await filterCustomersBy(page, displayName);
    const id = await editedRow.getAttribute('data-customer-id');
    await expect(
      page
        .locator(`[data-customer-id="${id}"]`)
        .filter({ hasText: newCompanyName }),
    ).toBeVisible({
      timeout: 15_000,
    });
  });

  test('should delete a customer successfully.', async ({ page }) => {
    await waitForCustomersList(page);

    const { firstName, lastName, displayName } = contactName();
    await createCustomer(page, {
      firstName,
      lastName,
      companyName: companyName(),
    });

    const row = await filterCustomersBy(page, displayName);
    await deleteCustomerViaRow(page, row);

    await expect(page.getByTestId('customer-row')).toHaveCount(0, {
      timeout: 15_000,
    });
  });
});
