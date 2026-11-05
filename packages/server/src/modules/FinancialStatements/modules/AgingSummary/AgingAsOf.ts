import * as moment from 'moment';

/**
 * A settlement of a document (payment, applied credit or write-off) with the
 * date it counts from, in the document's currency.
 */
export interface AgingSettlementRow {
  documentId: number;
  amount: number;
  date: Date | string;
}

/**
 * An invoice or bill as the aging needs it.
 */
export interface AgingDocumentInput {
  id: number;
  contactId: number;
  /** Document total in its own currency (the model's `total` getter). */
  total: number;
  exchangeRate: number | null;
  /** Invoice date or bill date. */
  documentDate: Date | string;
  dueDate: Date | string | null;
}

/**
 * A document that is open on the as-of date, with its amount in the base
 * currency and its overdue days counted from the as-of date.
 */
export interface IAgingDocument {
  id: number;
  contactId: number;
  dueAmountLocal: number;
  overdueDays: number;
}

export interface AgingDocumentsAsOf {
  current: IAgingDocument[];
  overdue: IAgingDocument[];
}

/**
 * Formats the given date as a `YYYY-MM-DD` key in local time, so dates
 * read from the database as local-midnight `Date` objects keep their day.
 * @param {Date | string} date
 * @returns {string}
 */
export const toDateKey = (date: Date | string): string =>
  moment(date).format('YYYY-MM-DD');

/**
 * Turns the invoices' write-offs into settlement rows dated on the
 * write-off date.
 * @param invoices - Invoices with their write-off amount and date.
 * @returns {AgingSettlementRow[]}
 */
export const writeoffSettlementRows = (
  invoices: Array<{
    id: number;
    writtenoffAmount: number | null;
    writtenoffAt: Date | string | null;
  }>,
): AgingSettlementRow[] =>
  invoices
    .filter((invoice) => invoice.writtenoffAt && invoice.writtenoffAmount > 0)
    .map((invoice) => ({
      documentId: invoice.id,
      amount: invoice.writtenoffAmount,
      date: invoice.writtenoffAt,
    }));

/**
 * Works out which documents are open on the as-of date and how overdue
 * they are on that date. Only settlements dated on or before the as-of
 * date reduce a document's open amount.
 * @param {AgingDocumentInput[]} docs - Documents dated on or before the as-of date.
 * @param {AgingSettlementRow[]} settlements - Settlements of those documents, any date.
 * @param {Date | string} asDate - The report's as-of date.
 * @returns {AgingDocumentsAsOf}
 */
export const getAgingDocumentsAsOf = (
  docs: AgingDocumentInput[],
  settlements: AgingSettlementRow[],
  asDate: Date | string,
): AgingDocumentsAsOf => {
  const asDateKey = toDateKey(asDate);

  const settledByDocumentId = new Map<number, number>();
  settlements.forEach((settlement) => {
    if (toDateKey(settlement.date) > asDateKey) return;

    settledByDocumentId.set(
      settlement.documentId,
      (settledByDocumentId.get(settlement.documentId) || 0) + settlement.amount,
    );
  });

  const current: IAgingDocument[] = [];
  const overdue: IAgingDocument[] = [];

  docs.forEach((doc) => {
    const settled = settledByDocumentId.get(doc.id) || 0;
    const openAmount = Math.round((doc.total - settled) * 100) / 100;

    if (openAmount <= 0) return;

    const dueDateKey = toDateKey(doc.dueDate ?? doc.documentDate);
    const isCurrent = dueDateKey >= asDateKey;
    const agingDocument: IAgingDocument = {
      id: doc.id,
      contactId: doc.contactId,
      dueAmountLocal: openAmount * (doc.exchangeRate ?? 1),
      overdueDays: isCurrent
        ? 0
        : moment(asDateKey).diff(moment(dueDateKey), 'days'),
    };
    (isCurrent ? current : overdue).push(agingDocument);
  });

  return { current, overdue };
};
