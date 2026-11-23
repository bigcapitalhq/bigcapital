import { Transformer } from '@/modules/Transformer/Transformer';
import { ItemEntryTransformer } from '@/modules/TransactionItemEntry/ItemEntry.transformer';
import { RecurringInvoice } from '../models/RecurringInvoice';

export class RecurringInvoiceTransformer extends Transformer {
  /**
   * Include these attributes to the recurring invoice object.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [
      'startDateFormatted',
      'endDateFormatted',
      'nextInvoiceDateFormatted',
      'lastInvoiceDateFormatted',
      'createdAtFormatted',
      'subtotalFormatted',
      'taxAmountFormatted',
      'discountAmountFormatted',
      'adjustmentFormatted',
      'totalFormatted',
      'entries',
    ];
  };

  protected startDateFormatted = (recurringInvoice: RecurringInvoice) => {
    return this.formatDate(recurringInvoice.startDate);
  };

  protected endDateFormatted = (recurringInvoice: RecurringInvoice) => {
    return this.formatDate(recurringInvoice.endDate);
  };

  protected nextInvoiceDateFormatted = (recurringInvoice: RecurringInvoice) => {
    return this.formatDate(recurringInvoice.nextInvoiceDate);
  };

  protected lastInvoiceDateFormatted = (recurringInvoice: RecurringInvoice) => {
    return this.formatDate(recurringInvoice.lastInvoiceDate);
  };

  protected createdAtFormatted = (recurringInvoice: RecurringInvoice) => {
    return this.formatDate(recurringInvoice.createdAt);
  };

  protected subtotalFormatted = (recurringInvoice: RecurringInvoice) => {
    return this.formatNumber(recurringInvoice.subtotal, {
      currencyCode: recurringInvoice.currencyCode,
    });
  };

  protected taxAmountFormatted = (recurringInvoice: RecurringInvoice) => {
    return this.formatNumber(recurringInvoice.taxAmount, {
      currencyCode: recurringInvoice.currencyCode,
    });
  };

  protected discountAmountFormatted = (recurringInvoice: RecurringInvoice) => {
    return this.formatNumber(recurringInvoice.discountAmount, {
      currencyCode: recurringInvoice.currencyCode,
    });
  };

  protected adjustmentFormatted = (recurringInvoice: RecurringInvoice) => {
    return this.formatNumber(recurringInvoice.adjustment, {
      currencyCode: recurringInvoice.currencyCode,
    });
  };

  protected totalFormatted = (recurringInvoice: RecurringInvoice) => {
    return this.formatNumber(recurringInvoice.total, {
      currencyCode: recurringInvoice.currencyCode,
    });
  };

  protected entries = (recurringInvoice: RecurringInvoice) => {
    return this.item(recurringInvoice.entries, new ItemEntryTransformer(), {
      currencyCode: recurringInvoice.currencyCode,
    });
  };
}
