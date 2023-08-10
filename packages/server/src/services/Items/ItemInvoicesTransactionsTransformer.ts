import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class ItemInvoicesTransactionsTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'formattedInvoiceDate',
      'formattedRate',
      'formattedCost',
    ];
  };

  /**
   * Formatted sell price.
   * @param item
   * @returns {string}
   */
  public formattedAmount(item): string {
    return formatNumber(item.amount, {
      currencyCode: item.invoice.currencyCode,
    });
  }

  /**
   * Formatted invoice date.
   * @param item
   * @returns
   */
  public formattedInvoiceDate = (entry): string => {
    return this.formatDate(entry.invoice.invoiceDate);
  };

  /**
   * Formatted item quantity.
   * @returns {string}
   */
  public formattedQuantity = (entry): string => {
    return entry.quantity;
  };

  /**
   * Formatted date.
   * @param entry
   * @returns {string}
   */
  public formattedRate = (entry): string => {
    return formatNumber(entry.rate, {
      currencyCode: entry.invoice.currencyCode,
    });
  };

  /**
   *
   * @param entry
   * @returns
   */
  public transform = (entry) => {
    return {
      invoiceId: entry.invoice.id,

      invoiceNumber: entry.invoice.invoiceNo,
      referenceNumber: entry.invoice.referenceNo,

      invoiceDate: entry.invoice.invoiceDate,
      formattedInvoiceDate: entry.formattedInvoiceDate,

      amount: entry.amount,
      formattedAmount: entry.formattedAmount,

      quantity: entry.quantity,
      formattedQuantity: entry.formattedQuantity,

      rate: entry.rate,
      formattedRate: entry.formattedRate,

      customerDisplayName: entry.invoice.customer.displayName,
      customerCurrencyCode: entry.invoice.customer.currencyCode,
    };
  };
}
