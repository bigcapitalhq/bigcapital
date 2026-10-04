import { transactionIncrement } from '@/utils/transaction-increment';
import { CreateSaleInvoiceDto } from '../dtos/SaleInvoice.dto';

/**
 * Days between the duplicate's invoice date (today) and its due date.
 */
export const DUPLICATE_SALE_INVOICE_DUE_DAYS = 7;

/**
 * Upper bound on the numbers tried when looking for an unused invoice number,
 * so a misconfigured sequence fails loudly instead of looping forever.
 */
export const DUPLICATE_SALE_INVOICE_MAX_NUMBER_TRIES = 1000;

/**
 * Invoice-level fields copied verbatim from the original invoice.
 */
const DUPLICATED_INVOICE_FIELDS = [
  'referenceNo',
  'invoiceMessage',
  'termsConditions',
  'discount',
  'discountType',
  'adjustment',
  'exchangeRate',
  'branchId',
  'warehouseId',
  'projectId',
  'pdfTemplateId',
] as const;

/**
 * Item entry fields accepted back by `ItemEntryDto`. The entry `id` is never
 * copied, so the duplicate always gets fresh entries, re-indexed in order.
 */
const DUPLICATED_ENTRY_FIELDS = [
  'itemId',
  'quantity',
  'rate',
  'description',
  'discount',
  'discountType',
  'taxRateId',
  'warehouseId',
  'projectId',
  'sellAccountId',
  'costAccountId',
] as const;

const pickDefined = <T extends Record<string, any>>(
  source: T,
  keys: readonly string[],
): Partial<T> =>
  keys.reduce(
    (acc, key) =>
      source[key] === null || source[key] === undefined
        ? acc
        : { ...acc, [key]: source[key] },
    {} as Partial<T>,
  );

/**
 * Transforms an existing sale invoice to the create DTO of its duplicate.
 *
 * The duplicate keeps the customer, the line items, the message, the terms
 * and conditions, the discount, the adjustment and the payment options, is
 * dated today, falls due `DUPLICATE_SALE_INVOICE_DUE_DAYS` later and is always
 * created as a draft. Payments, attachments and the delivered state belong to
 * the original invoice and are never copied.
 * @param {Record<string, any>} saleInvoice - The original invoice with `entries` and `paymentMethods`.
 * @param {{ invoiceDate: Date; dueDate: Date; invoiceNo?: string }} overrides
 * @returns {CreateSaleInvoiceDto}
 */
export const transformSaleInvoiceToDuplicateDTO = (
  saleInvoice: Record<string, any>,
  overrides: { invoiceDate: Date; dueDate: Date; invoiceNo?: string },
): CreateSaleInvoiceDto => {
  const entries = [...(saleInvoice.entries ?? [])]
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((entry, index) => ({
      index: index + 1,
      ...pickDefined(entry, DUPLICATED_ENTRY_FIELDS),
    }));
  const paymentMethods = (saleInvoice.paymentMethods ?? []).map(
    (paymentMethod) => ({
      paymentIntegrationId: paymentMethod.paymentIntegrationId,
      enable: Boolean(paymentMethod.enable),
    }),
  );
  return {
    ...pickDefined(saleInvoice, DUPLICATED_INVOICE_FIELDS),
    customerId: saleInvoice.customerId,
    invoiceDate: overrides.invoiceDate,
    dueDate: overrides.dueDate,
    ...(overrides.invoiceNo ? { invoiceNo: overrides.invoiceNo } : {}),
    // Stored as a tinyint; the DTO validates a real boolean.
    isInclusiveTax: Boolean(saleInvoice.isInclusiveTax),
    delivered: false,
    entries,
    ...(paymentMethods.length > 0 ? { paymentMethods } : {}),
  } as CreateSaleInvoiceDto;
};

/**
 * Resolves the invoice number of a duplicate.
 *
 * With auto-increment enabled the duplicate takes the next number of the
 * configured sequence, so this returns the `next_number` to persist when the
 * sequence currently points at numbers that are already in use, and leaves
 * `invoiceNo` empty for the regular create flow to assign. The sale invoice
 * created subscriber then advances the sequence as usual.
 *
 * With auto-increment disabled there is no sequence to follow, so the
 * original invoice number is incremented until an unused one is found.
 * @param {{ autoIncrement: boolean; prefix: string; nextNumber: string }} settings
 * @param {string} originalInvoiceNo
 * @param {(invoiceNo: string) => Promise<boolean>} isInvoiceNoTaken
 * @returns {Promise<{ invoiceNo?: string; nextNumber?: string }>}
 */
export const resolveDuplicateInvoiceNumber = async (
  settings: { autoIncrement: boolean; prefix: string; nextNumber: string },
  originalInvoiceNo: string,
  isInvoiceNoTaken: (invoiceNo: string) => Promise<boolean>,
): Promise<{ invoiceNo?: string; nextNumber?: string }> => {
  if (settings.autoIncrement) {
    let nextNumber = settings.nextNumber;

    for (let i = 0; i < DUPLICATE_SALE_INVOICE_MAX_NUMBER_TRIES; i++) {
      if (!(await isInvoiceNoTaken(`${settings.prefix}${nextNumber}`))) {
        return nextNumber === settings.nextNumber ? {} : { nextNumber };
      }
      nextNumber = transactionIncrement(nextNumber);
    }
  } else {
    let invoiceNo = transactionIncrement(originalInvoiceNo ?? '');

    for (let i = 0; i < DUPLICATE_SALE_INVOICE_MAX_NUMBER_TRIES; i++) {
      if (!(await isInvoiceNoTaken(invoiceNo))) {
        return { invoiceNo };
      }
      invoiceNo = transactionIncrement(invoiceNo);
    }
  }
  throw new Error(
    `Could not find an unused invoice number after ${DUPLICATE_SALE_INVOICE_MAX_NUMBER_TRIES} tries.`,
  );
};
