import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class ItemBillTransactionTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'formattedBillDate',
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
      currencyCode: item.bill.currencyCode,
    });
  }

  /**
   * Formatted bill date.
   * @param item
   * @returns {string}
   */
  public formattedBillDate = (entry): string => {
    return this.formatDate(entry.bill.billDate);
  };

  /**
   * Formatted quantity.
   * @returns {string}
   */
  public formattedQuantity = (entry): string => {
    return entry.quantity;
  };

  /**
   * Formatted rate.
   * @param entry
   * @returns {string}
   */
  public formattedRate = (entry): string => {
    return formatNumber(entry.rate, {
      currencyCode: entry.bill.currencyCode,
    });
  };

  /**
   * Formatted bill due date.
   * @param entry
   * @returns
   */
  public formattedBillDueDate = (entry): string => {
    return this.formatDate(entry.bill.dueDate);
  };

  /**
   *
   * @param entry
   * @returns
   */
  public transform = (entry) => {
    return {
      billId: entry.bill.id,

      billNumber: entry.bill.billNumber,
      referenceNumber: entry.bill.referenceNo,

      billDate: entry.bill.billDate,
      formattedBillDate: entry.formattedBillDate,

      billDueDate: entry.bill.dueDate,
      formattedBillDueDate: entry.formattedBillDueDate,

      amount: entry.amount,
      formattedAmount: entry.formattedAmount,

      quantity: entry.quantity,
      formattedQuantity: entry.formattedQuantity,

      rate: entry.rate,
      formattedRate: entry.formattedRate,

      vendorDisplayName: entry.bill.vendor.displayName,
      vendorCurrencyCode: entry.bill.vendor.currencyCode,
    };
  };
}
