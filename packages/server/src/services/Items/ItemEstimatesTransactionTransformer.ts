import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class ItemEstimateTransactionTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'formattedEstimateDate',
      'formattedRate',
      'formattedCost',
    ];
  };

  /**
   * Formatted sell price.
   * @returns {string}
   */
  public formattedAmount(item): string {
    return formatNumber(item.amount, {
      currencyCode: item.estimate.currencyCode,
    });
  }

  /**
   * Formatted estimate date.
   * @returns {string}
   */
  public formattedEstimateDate = (entry): string => {
    return this.formatDate(entry.estimate.estimateDate);
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
   * @returns {string}
   */
  public formattedRate = (entry): string => {
    return formatNumber(entry.rate, {
      currencyCode: entry.estimate.currencyCode,
    });
  };

  /**
   *
   * @param entry
   * @returns
   */
  public transform = (entry) => {
    return {
      estimateId: entry.estimate.id,

      estimateNumber: entry.estimate.estimateNumber,
      referenceNumber: entry.estimate.referenceNo,

      estimateDate: entry.estimate.estimateDate,
      formattedEstimateDate: entry.formattedEstimateDate,

      amount: entry.amount,
      formattedAmount: entry.formattedAmount,

      quantity: entry.quantity,
      formattedQuantity: entry.formattedQuantity,

      rate: entry.rate,
      formattedRate: entry.formattedRate,

      customerDisplayName: entry.estimate.customer.displayName,
      customerCurrencyCode: entry.estimate.customer.currencyCode,
    };
  };
}
