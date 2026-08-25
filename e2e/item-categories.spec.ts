import { test, expect, type Locator, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

const categoryName = () =>
  `${faker.commerce.department()} ${faker.string.alphanumeric(4)}`;

/**
 * Waits until the item categories page is loaded.
 */
async function waitForItemCategories(page: Page) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    'Categories List',
    { timeout: 30_000 },
  );
  await expect(
    page.getByRole('button', { name: 'New Category' }),
  ).toBeVisible({ timeout: 30_000 });
}

/**
 * Opens the new category dialog.
 */
async function openNewCategoryDialog(page: Page) {
  await page.getByRole('button', { name: 'New Category' }).first().click();

  const dialog = page.getByTestId('category-form-dialog');
  await expect(dialog).toBeVisible({ timeout: 30_000 });
  await expect(dialog.getByTestId('category-name-input')).toBeVisible({
    timeout: 30_000,
  });

  return dialog;
}

/**
 * Creates an item category through the UI and expects the success toast
 * alongside the new row in the table.
 */
async function createCategory(
  page: Page,
  { name, description }: { name: string; description: string },
) {
  const dialog = await openNewCategoryDialog(page);

  await dialog.getByTestId('category-name-input').fill(name);
  await dialog.getByTestId('category-description-input').fill(description);
  await dialog.getByRole('button', { name: 'Submit' }).click();

  await expect(dialog).toBeHidden({ timeout: 30_000 });
  await expect(
    page.getByText('The item category has been created successfully.'),
  ).toBeVisible({ timeout: 15_000 });

  const row = page
    .getByTestId('category-row')
    .filter({ hasText: name })
    .first();
  await expect(row).toBeVisible({ timeout: 15_000 });

  return row;
}

/**
 * Deletes the given category row through the context menu and expects the
 * success toast.
 */
async function deleteCategoryViaRow(page: Page, row: Locator) {
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Delete Category' }).click();

  await expect(page.getByTestId('category-delete-alert')).toBeVisible();
  await page
    .getByRole('dialog')
    .filter({ hasText: 'delete this category' })
    .getByRole('button', { name: 'Delete' })
    .click();

  await expect(
    page.getByText('The item category has been deleted successfully.'),
  ).toBeVisible({ timeout: 15_000 });
}

test.describe('item categories', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/items/categories');
  });

  test('should show the item categories page.', async ({ page }) => {
    await waitForItemCategories(page);
  });

  test('should validate the required fields of the new category dialog.', async ({
    page,
  }) => {
    await waitForItemCategories(page);

    const dialog = await openNewCategoryDialog(page);
    await dialog.getByRole('button', { name: 'Submit' }).click();

    await expect(dialog).toContainText('Category name is a required field');
  });

  test('should create an item category successfully.', async ({ page }) => {
    await waitForItemCategories(page);

    const name = categoryName();
    const description = faker.lorem.sentence();

    await createCategory(page, { name, description });
  });

  test('should edit an item category successfully.', async ({ page }) => {
    await waitForItemCategories(page);

    const name = categoryName();
    const newName = categoryName();
    const description = faker.lorem.sentence();

    await createCategory(page, { name, description });

    const row = page
      .getByTestId('category-row')
      .filter({ hasText: name })
      .first();
    await row.click({ button: 'right' });
    await page.getByRole('menuitem', { name: 'Edit Category' }).click();

    const dialog = page.getByTestId('category-form-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTestId('category-name-input')).toHaveValue(name, {
      timeout: 30_000,
    });

    await dialog.getByTestId('category-name-input').fill(newName);
    await dialog.getByRole('button', { name: 'Edit' }).click();

    await expect(dialog).toBeHidden({ timeout: 30_000 });
    await expect(
      page.getByText('The item category has been edited successfully.'),
    ).toBeVisible({ timeout: 15_000 });

    await expect(
      page.getByTestId('category-row').filter({ hasText: newName }).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('should delete an item category successfully.', async ({ page }) => {
    await waitForItemCategories(page);

    const name = categoryName();
    const description = faker.lorem.sentence();

    const row = await createCategory(page, { name, description });
    await deleteCategoryViaRow(page, row);

    await expect(
      page.getByTestId('category-row').filter({ hasText: name }),
    ).toHaveCount(0);
  });

  test('should the category name be unique.', async ({ page }) => {
    await waitForItemCategories(page);

    const name = categoryName();
    const description = faker.lorem.sentence();

    await createCategory(page, { name, description });

    const dialog = await openNewCategoryDialog(page);
    await dialog.getByTestId('category-name-input').fill(name);
    await dialog.getByRole('button', { name: 'Submit' }).click();

    await expect(dialog).toContainText('Category name exists');
  });
});
