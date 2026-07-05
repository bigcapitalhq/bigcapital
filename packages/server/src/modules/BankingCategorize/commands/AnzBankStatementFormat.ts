import { createHash } from 'crypto';
import * as moment from 'moment';

/**
 * ANZ (NZ) bank statement export support.
 *
 * ANZ CSV exports use the columns:
 *   Type, Details, Particulars, Code, Reference, Amount, Date,
 *   ForeignCurrencyAmount, ConversionCharge
 *
 * The merchant/counterparty lives in a DIFFERENT column depending on the
 * transaction type: card transactions (Visa Purchase/Refund) carry the
 * masked card number in `Details` and the merchant in `Code`, while all
 * other types carry the counterparty in `Details`. Dates are dd/MM/yyyy.
 *
 * `transformAnzStatementRows` normalizes rows in place of the original
 * columns so the standard import mapping works naturally:
 *   Date -> date (ISO), Details -> payee (resolved), Particulars ->
 *   description (type + FX note), Reference -> referenceNo (occurrence
 *   suffixed for exact duplicates within the same file, keeping re-imports
 *   deterministic).
 */
export const ANZ_BANK_FORMAT = 'anz-nz';

const ANZ_SIGNATURE_COLUMNS = [
  'Type',
  'Details',
  'Particulars',
  'Code',
  'Reference',
  'Amount',
  'Date',
];

const ANZ_CARD_TYPES = /^visa\s+(purchase|refund)$/i;

const str = (value: unknown): string =>
  value === null || value === undefined ? '' : String(value).trim();

/**
 * Detects whether the parsed sheet is an ANZ (NZ) statement export.
 *
 * Prefers the explicit sheet columns (from the upload step) since the
 * sheet parser omits empty cells, so individual rows may miss columns.
 * @param {Record<string, unknown>[]} rows - Parsed sheet rows.
 * @param {string[]} sheetColumns - Sheet header columns, when known.
 */
export const isAnzBankStatementSheet = (
  rows: Record<string, unknown>[],
  sheetColumns?: string[],
): boolean => {
  if (!rows?.length && !sheetColumns?.length) return false;

  const columns = sheetColumns?.length
    ? sheetColumns
    : Array.from(
        new Set(rows.slice(0, 25).flatMap((row) => Object.keys(row))),
      );
  return ANZ_SIGNATURE_COLUMNS.every((column) => columns.includes(column));
};

/**
 * Normalizes ANZ statement rows onto the standard bank import columns.
 */
export const transformAnzStatementRows = (
  rows: Record<string, unknown>[],
): Record<string, unknown>[] => {
  const occurrences = new Map<string, number>();

  return rows.map((row) => {
    const type = str(row['Type']);
    const isCard = ANZ_CARD_TYPES.test(type);

    const details = str(row['Details']);
    const code = str(row['Code']);
    const payee = isCard ? code || details : details || code;

    const foreignAmount = str(row['ForeignCurrencyAmount']);
    const description = foreignAmount ? `${type} - ${foreignAmount}` : type;

    const date = moment(str(row['Date']), 'DD/MM/YYYY', true);
    const isoDate = date.isValid() ? date.format('YYYY-MM-DD') : str(row['Date']);

    let reference = str(row['Reference']) || str(row['Particulars']);

    // Suffix exact duplicates within the file so the dedup id stays unique
    // and deterministic across re-imports of overlapping exports.
    const occurrenceKey = [isoDate, str(row['Amount']), payee, reference].join(
      '|',
    );
    const occurrence = (occurrences.get(occurrenceKey) || 0) + 1;
    occurrences.set(occurrenceKey, occurrence);

    if (occurrence > 1) {
      reference = reference ? `${reference} #${occurrence}` : `#${occurrence}`;
    }
    return {
      ...row,
      Date: isoDate,
      Details: payee,
      Particulars: description,
      Reference: reference,
    };
  });
};

/**
 * Builds a deterministic unique id for an imported bank transaction, used
 * to skip already-imported rows on re-import.
 */
export const buildBankTransactionUniqueId = (
  accountId: number | string,
  dto: {
    date: unknown;
    amount: unknown;
    payee?: unknown;
    referenceNo?: unknown;
  },
): string => {
  const date = moment(dto.date as moment.MomentInput).isValid()
    ? moment(dto.date as moment.MomentInput).format('YYYY-MM-DD')
    : str(dto.date);
  const key = [
    ANZ_BANK_FORMAT,
    str(accountId),
    date,
    String(Number(dto.amount)),
    str(dto.payee),
    str(dto.referenceNo),
  ].join('|');

  return `imp-${createHash('sha1').update(key).digest('hex').slice(0, 32)}`;
};
