import { test, expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

/**
 * Waits until the API keys preferences page is loaded.
 */
async function waitForApiKeysPage(page: Page) {
  await expect(
    page.getByRole('button', { name: 'Generate API Key' }),
  ).toBeVisible({ timeout: 30_000 });
}

test.describe('api keys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preferences/api-keys');
  });

  test('should show the api keys preferences page.', async ({ page }) => {
    await waitForApiKeysPage(page);
  });

  test('should open the generate dialog and generate a key.', async ({
    page,
  }) => {
    await waitForApiKeysPage(page);

    await page.getByRole('button', { name: 'Generate API Key' }).click();

    // Regression: the dialog previously never rendered because the redux
    // `<Dialog>` wrapper around the form content was missing.
    const dialog = page.getByRole('dialog', { name: 'Generate API Key' });
    await expect(dialog).toBeVisible({ timeout: 15_000 });

    await dialog
      .getByPlaceholder('Enter API key name')
      .fill(`e2e ${faker.string.alphanumeric(6)}`);
    await dialog.getByRole('button', { name: 'Generate', exact: true }).click();

    // The generated key is returned by the SDK and shown once in a
    // read-only field.
    await expect(
      dialog.getByText('This API key will only be shown once.', {
        exact: false,
      }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(dialog.locator('input[readonly]')).toHaveValue(
      /^bc_[0-9a-f]+$/,
      { timeout: 15_000 },
    );

    await dialog.getByRole('button', { name: 'Done' }).click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });
  });

  test('should validate the required name field.', async ({ page }) => {
    await waitForApiKeysPage(page);

    await page.getByRole('button', { name: 'Generate API Key' }).click();

    const dialog = page.getByRole('dialog', { name: 'Generate API Key' });
    await expect(dialog).toBeVisible({ timeout: 15_000 });

    await dialog.getByRole('button', { name: 'Generate', exact: true }).click();
    await expect(dialog).toContainText('Name is required');
  });
});
