import * as moment from 'moment';

export const BANK_IMPORT_DUPLICATE_ERROR_CODE = 'DuplicateBankTransaction';

/**
 * The bank transaction fields that identify the same transaction across
 * imports. Every mapped field takes part, so matching is as strict as the
 * data the user imported.
 */
export interface BankRowKeyFields {
  date?: string | Date | null;
  amount?: number | string | null;
  payee?: string | null;
  description?: string | null;
  referenceNo?: string | null;
}

/**
 * Retrieves the date as YYYY-MM-DD, or null when it's missing or not a
 * YYYY-MM-DD date (the import validator rejects those rows anyway).
 * @param {unknown} date
 * @returns {string | null}
 */
export const parseBankRowDate = (date: unknown): string | null => {
  const parsed =
    date instanceof Date
      ? moment(date)
      : moment(date as string, 'YYYY-MM-DD', true);

  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null;
};

const normalizeAmount = (amount: BankRowKeyFields['amount']): string =>
  Number(amount).toFixed(2);

/**
 * Trims, collapses whitespace and ignores letter case. Null, undefined and an
 * empty string are the same value.
 */
const normalizeText = (text: string | null | undefined): string =>
  String(text ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

/**
 * Retrieves the key two rows share when they are the same bank transaction.
 * @param {BankRowKeyFields} row
 * @returns {string}
 */
export const bankRowKey = (row: BankRowKeyFields): string =>
  [
    parseBankRowDate(row.date) ?? '',
    normalizeAmount(row.amount),
    normalizeText(row.payee),
    normalizeText(row.description),
    normalizeText(row.referenceNo),
  ].join('\u0000');

/**
 * Retrieves the indexes of the file rows that are already in the account.
 * For each key, the first N occurrences in file order are duplicates, where
 * N is how many rows with that key the account already has; the rest are new.
 * So identical rows in one file still import. A file row without a valid
 * date is never a duplicate; it fails validation later instead.
 * @param {BankRowKeyFields[]} fileRows - Rows of the imported file, in order.
 * @param {BankRowKeyFields[]} existingRows - Rows already in the account.
 * @returns {number[]}
 */
export const findDuplicateRowIndexes = (
  fileRows: BankRowKeyFields[],
  existingRows: BankRowKeyFields[],
): number[] => {
  const remaining = new Map<string, number>();

  existingRows.forEach((row) => {
    const key = bankRowKey(row);
    remaining.set(key, (remaining.get(key) || 0) + 1);
  });
  const duplicateIndexes: number[] = [];

  fileRows.forEach((row, index) => {
    if (!parseBankRowDate(row.date)) return;

    const key = bankRowKey(row);
    const count = remaining.get(key) || 0;

    if (count > 0) {
      duplicateIndexes.push(index);
      remaining.set(key, count - 1);
    }
  });
  return duplicateIndexes;
};

/**
 * Retrieves the message shown for a skipped duplicate row. The import preview
 * has no unique value for bank rows, so the message identifies the row.
 * @param {BankRowKeyFields} row
 * @returns {string}
 */
export const formatDuplicateRowMessage = (row: BankRowKeyFields): string => {
  const text = row.payee || row.description;
  const parts = [parseBankRowDate(row.date), text, normalizeAmount(row.amount)];

  return `Already in this bank account: ${parts.filter(Boolean).join(', ')}`;
};
