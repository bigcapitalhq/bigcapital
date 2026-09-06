import { expect, type Page } from '@playwright/test';

export const DEBIT_ACCOUNT = 'Petty Cash';
export const CREDIT_ACCOUNT = 'Opening Balance Equity';

/**
 * Waits until the manual journals list page is loaded.
 */
export async function waitForJournalsPage(page: Page) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    'Manual Journals',
    { timeout: 30_000 },
  );
  await expect(
    page.getByRole('button', { name: 'Journal Entry' }).first(),
  ).toBeVisible({ timeout: 30_000 });
}

/**
 * Waits until the journal form page is loaded for the given title
 * (new or edit).
 */
export async function waitForJournalFormPage(page: Page, title: string) {
  await expect(page.getByTestId('dashboard-topbar').locator('h1')).toHaveText(
    title,
    { timeout: 30_000 },
  );
  await expect(page.getByTestId('journal-date-input')).toBeVisible({
    timeout: 30_000,
  });
}

/**
 * Selects the given account inside the journal entries table. The account cell
 * is scoped to the journal form via `journal-account-cell`, and the given
 * `index` targets the matching entries line.
 */
export async function selectEntryAccount(
  page: Page,
  index: number,
  name: string,
) {
  const cell = page.getByTestId('journal-account-cell').nth(index);
  const input = cell.locator('input');
  await input.click();
  await input.pressSequentially(name);

  const item = page.getByRole('menuitem', { name: new RegExp(name) }).first();
  await expect(item).toBeVisible({ timeout: 10_000 });
  await item.click();
}

/**
 * Fills the debit amount of the given entries line and commits the value by
 * pressing Tab (which triggers the blur/commit and auto-adds the next line).
 */
export async function fillDebit(page: Page, index: number, amount: number) {
  const input = page.getByTestId('journal-debit-input').nth(index);
  await input.click();
  await input.fill(String(amount));
  await input.press('Tab');
}

/**
 * Fills the credit amount of the given entries line and commits the value by
 * pressing Tab (which triggers the blur/commit and auto-adds the next line).
 */
export async function fillCredit(page: Page, index: number, amount: number) {
  const input = page.getByTestId('journal-credit-input').nth(index);
  await input.click();
  await input.fill(String(amount));
  await input.press('Tab');
}

/**
 * Creates a journal through the UI and expects the success toast alongside
 * the redirect back to the journals list page. The journal number is
 * auto-incremented and read from the form, and returned for later assertions.
 */
export async function createJournal(
  page: Page,
  {
    reference,
    description,
    amount,
    publish = true,
    debitAccount = DEBIT_ACCOUNT,
    creditAccount = CREDIT_ACCOUNT,
  }: {
    reference?: string;
    description?: string;
    amount: number;
    publish?: boolean;
    debitAccount?: string;
    creditAccount?: string;
  },
): Promise<string> {
  await waitForJournalsPage(page);

  await page.getByRole('button', { name: 'Journal Entry' }).first().click();
  await waitForJournalFormPage(page, 'New Journal');

  const journalNumberInput = page.getByTestId('journal-number-input');
  await expect(journalNumberInput).not.toHaveValue('', { timeout: 30_000 });
  const journalNumber = await journalNumberInput.inputValue();

  if (reference) {
    await page.getByTestId('journal-reference-input').fill(reference);
  }
  if (description) {
    const descriptionInput = page.getByTestId('journal-description-input');
    await descriptionInput.click();
    await descriptionInput.locator('textarea').fill(description);
  }

  await selectEntryAccount(page, 0, debitAccount);
  await fillDebit(page, 0, amount);
  await selectEntryAccount(page, 1, creditAccount);
  await fillCredit(page, 1, amount);

  await page
    .getByRole('button', { name: publish ? 'Save and Publish' : 'Save as Draft' })
    .click();

  await expect(
    page.getByText(
      new RegExp(`The journal #${journalNumber} has been created successfully\\.`),
    ),
  ).toBeVisible({ timeout: 15_000 });

  await waitForJournalsPage(page);

  return journalNumber;
}