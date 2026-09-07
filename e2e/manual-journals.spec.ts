import { test, expect, type Locator, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import {
  createJournal,
  selectEntryAccount,
  waitForJournalsPage,
  waitForJournalFormPage,
} from './_journals';

const referenceNo = () => `JR-${faker.string.alphanumeric(6).toUpperCase()}`;

const journalAmount = () => faker.number.int({ min: 1000, max: 50000 });

/**
 * Filters the journals table by the given journal number and returns the
 * matching row locator. The journal number is unique per journal, so the
 * filtered table holds a single row.
 */
async function filterJournalsBy(page: Page, journalNumber: string) {
  await page.getByRole('button', { name: /filter|filters applied/i }).click();
  await page.getByPlaceholder('Value').first().fill(journalNumber);

  const row = page.getByTestId('manual-journal-row').first();
  await expect(row).toBeVisible({ timeout: 30_000 });

  // Close the filter popover before interacting with the table.
  await page.keyboard.press('Escape');

  return row;
}

/**
 * Deletes the given journal row through the context menu and expects the
 * success toast.
 */
async function deleteJournalViaRow(page: Page, row: Locator) {
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Delete Journal' }).click();

  await expect(page.getByTestId('journal-delete-alert')).toBeVisible();
  await page
    .getByRole('dialog')
    .filter({ has: page.getByTestId('journal-delete-alert') })
    .getByRole('button', { name: 'Delete' })
    .click();

  await expect(
    page.getByText('The journal has been deleted successfully'),
  ).toBeVisible({ timeout: 15_000 });
}

/**
 * Publishes the given draft journal row through the context menu and expects
 * the success toast.
 */
async function publishJournalViaRow(page: Page, row: Locator) {
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Publish Journal' }).click();

  await expect(page.getByTestId('journal-publish-alert')).toBeVisible();
  await page
    .getByRole('dialog')
    .filter({ has: page.getByTestId('journal-publish-alert') })
    .getByRole('button', { name: 'Publish' })
    .click();

  await expect(
    page.getByText('The manual journal has been published successfully.'),
  ).toBeVisible({ timeout: 15_000 });
}

/**
 * Opens the journal details drawer through the row context menu and returns
 * the drawer locator.
 */
async function openJournalDetails(page: Page, row: Locator) {
  await row.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'View Details' }).click();

  const drawer = page.getByTestId('journal-details-drawer');
  await expect(drawer).toBeVisible({ timeout: 15_000 });

  return drawer;
}

test.describe('manual journals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/manual-journals');
  });

  test('should show the manual journals page.', async ({ page }) => {
    await waitForJournalsPage(page);

    await expect(
      page.getByRole('button', { name: 'Journal Entry' }).first(),
    ).toBeVisible();
  });

  test('should validate that credit and debit totals match.', async ({
    page,
  }) => {
    await waitForJournalsPage(page);

    await page.getByRole('button', { name: 'Journal Entry' }).first().click();
    await waitForJournalFormPage(page, 'New Journal');

    // Fill a single debit line without a matching credit line.
    await selectEntryAccount(page, 0, 'Petty Cash');
    const debitInput = page.getByTestId('journal-debit-input').first();
    await debitInput.click();
    await debitInput.fill(String(journalAmount()));
    await debitInput.press('Tab');

    await page.getByRole('button', { name: 'Save and Publish' }).click();

    await expect(
      page.getByText('Should total of credit and debit be equal.'),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('should create a journal (draft) successfully.', async ({ page }) => {
    await waitForJournalsPage(page);

    const reference = referenceNo();
    const amount = journalAmount();

    const journalNumber = await createJournal(page, {
      reference,
      description: faker.lorem.sentence(),
      amount,
      publish: false,
    });

    const row = await filterJournalsBy(page, journalNumber);
    await expect(row.getByText('Draft')).toBeVisible();
  });

  test('should create and publish a journal successfully.', async ({
    page,
  }) => {
    await waitForJournalsPage(page);

    const reference = referenceNo();
    const amount = journalAmount();

    const journalNumber = await createJournal(page, {
      reference,
      description: faker.lorem.sentence(),
      amount,
    });

    const row = await filterJournalsBy(page, journalNumber);
    await expect(row.getByText('Published')).toBeVisible();
  });

  test('should publish a draft journal.', async ({ page }) => {
    await waitForJournalsPage(page);

    const reference = referenceNo();
    const amount = journalAmount();

    const journalNumber = await createJournal(page, {
      reference,
      amount,
      publish: false,
    });

    const row = await filterJournalsBy(page, journalNumber);
    await expect(row.getByText('Draft')).toBeVisible();

    await publishJournalViaRow(page, row);

    const publishedRow = await filterJournalsBy(page, journalNumber);
    await expect(publishedRow.getByText('Published')).toBeVisible();
  });

  test('should view the journal details drawer.', async ({ page }) => {
    await waitForJournalsPage(page);

    const reference = referenceNo();
    const amount = journalAmount();

    const journalNumber = await createJournal(page, {
      reference,
      description: faker.lorem.sentence(),
      amount,
    });

    const row = await filterJournalsBy(page, journalNumber);
    const drawer = await openJournalDetails(page, row);

    await expect(drawer.getByText(journalNumber)).toBeVisible();
    await expect(drawer.getByText(reference)).toBeVisible();
    await expect(drawer.getByText('Published')).toBeVisible();
    await expect(drawer.getByText('Petty Cash')).toBeVisible();
    await expect(drawer.getByText('Opening Balance Equity')).toBeVisible();
  });

  test('should edit a journal successfully.', async ({ page }) => {
    await waitForJournalsPage(page);

    const ref = referenceNo();
    const newRef = referenceNo();
    const amount = journalAmount();

    const journalNumber = await createJournal(page, {
      reference: ref,
      description: faker.lorem.sentence(),
      amount,
    });

    const row = await filterJournalsBy(page, journalNumber);
    await row.click({ button: 'right' });
    await page.getByRole('menuitem', { name: 'Edit Journal' }).click();

    await waitForJournalFormPage(page, 'Edit Journal');
    await expect(page.getByTestId('journal-reference-input')).toHaveValue(ref, {
      timeout: 30_000,
    });

    await page.getByTestId('journal-reference-input').fill(newRef);
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    await expect(
      page.getByText(
        new RegExp(`The journal #${journalNumber} has been edited successfully\\.`),
      ),
    ).toBeVisible({ timeout: 15_000 });

    await waitForJournalsPage(page);

    const editedRow = await filterJournalsBy(page, journalNumber);

    // The edited reference should be reflected in the details drawer.
    const drawer = await openJournalDetails(page, editedRow);
    await expect(drawer.getByText(newRef)).toBeVisible();
  });

  test('should delete a journal successfully.', async ({ page }) => {
    await waitForJournalsPage(page);

    const reference = referenceNo();
    const amount = journalAmount();

    const journalNumber = await createJournal(page, {
      reference,
      amount,
    });

    const row = await filterJournalsBy(page, journalNumber);
    await deleteJournalViaRow(page, row);

    await expect(page.getByTestId('manual-journal-row')).toHaveCount(0, {
      timeout: 15_000,
    });
  });
});