import { Transformer } from '../Transformer/Transformer';

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
    return this.formatNumber(item.amount, {
      currencyCode: item.receipt.currencyCode,
    });
  }

  /**
   * Formatted receipt date.
   * @param {any} entry
   * @returns {string}
   */
  public formattedReceiptDate = (entry): string => {
    return this.formatDate(entry.receipt.receiptDate);
  };

  /**
   * Formatted quantity.
   * @param {any} entry
   * @returns {string}
   */
  public formattedQuantity = (entry): string => {
    return entry.quantity;
  };

  /**
   * Formatted rate.
   * @param {any} entry
   * @returns {string}
   */
  public formattedRate = (entry): string => {
    return this.formatNumber(entry.rate, {
      currencyCode: entry.receipt.currencyCode,
    });
  };

  /**
   * Transform the entry.
   * @param {any} entry
   * @returns {any}
   */
  public transform = (entry) => {
    return {
      receiptId: entry.receipt.id,

      receipNumber: entry.receipt.receiptNumber,
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
