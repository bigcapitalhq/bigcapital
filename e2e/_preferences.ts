import { expect, type Page } from '@playwright/test';

/**
 * Waits until the given preferences page is loaded by asserting the
 * preferences topbar title alongside the form's Save button.
 */
export async function waitForPreferencesPage(page: Page, title: string) {
  await expect(page.getByTestId('preferences-topbar-title')).toHaveText(title, {
    timeout: 30_000,
  });
  await expect(
    page.getByRole('button', { name: 'Save', exact: true }),
  ).toBeVisible({ timeout: 30_000 });
}

/**
 * Selects the given account inside the preferences account select.
 *
 * The select popover cannot be opened reliably with a plain mouse click, so it
 * is retried the same way the account type select does: focus the trigger,
 * press Enter to open the popover, then immediately click the matching menu
 * item before the popover collapses.
 */
export async function selectAccountFromDropdown(
  page: Page,
  buttonTestId: string,
  accountName: string,
) {
  const button = page.getByTestId(buttonTestId);

  for (let attempt = 0; attempt < 8; attempt++) {
    await button.focus();
    await page.keyboard.press('Enter');

    const clicked = await page.evaluate((accountName) => {
      const items = Array.from(
        document.querySelectorAll('[role="menuitem"]'),
      );
      const item = items.find((el) =>
        (el as HTMLElement).innerText.includes(accountName),
      );
      if (item) {
        (item as HTMLElement).click();
        return true;
      }
      return false;
    }, accountName);

    if (clicked) {
      await expect(button).toContainText(accountName, { timeout: 5_000 });
      return;
    }
    await page.keyboard.press('Escape');
  }
  throw new Error(`Failed to select the ${accountName} account.`);
}

/**
 * Clicks the form's Save button and expects the given success message toast.
 */
export async function savePreferences(page: Page, successMessage: string) {
  await page.getByRole('button', { name: 'Save', exact: true }).click();

  await expect(page.getByText(successMessage)).toBeVisible({ timeout: 15_000 });
}
