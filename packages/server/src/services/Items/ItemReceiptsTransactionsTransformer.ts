import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class ItemReceiptTransactionTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'formattedReceiptDate',
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
      currencyCode: item.receipt.currencyCode,
    });
  }

  /**
   *
   * @param item
   * @returns
   */
  public formattedReceiptDate = (entry): string => {
    return this.formatDate(entry.receipt.receiptDate);
  };

  /**
   *
   */
  public formattedQuantity = (entry): string => {
    return entry.quantity;
  };

  /**
   *
   * @param entry
   * @returns
   */
  public formattedRate = (entry): string => {
    return formatNumber(entry.rate, {
      currencyCode: entry.receipt.currencyCode,
    });
  };

  /**
   *
   * @param entry
   * @returns
   */
  public transform = (entry) => {
    return {
      receiptId: entry.receipt.id,

      receiptNumber: entry.receipt.receiptNumber,
      referenceNumber: entry.receipt.referenceNo,

      receiptDate: entry.receipt.receiptDate,
      formattedReceiptDate: entry.formattedReceiptDate,

      amount: entry.amount,
      formattedAmount: entry.formattedAmount,

      quantity: entry.quantity,
      formattedQuantity: entry.formattedQuantity,

      rate: entry.rate,
      formattedRate: entry.formattedRate,

      customerDisplayName: entry.receipt.customer.displayName,
      customerCurrencyCode: entry.receipt.customer.currencyCode,
    };
  };
}
