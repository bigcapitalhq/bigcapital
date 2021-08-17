import { Service } from 'typedi';
import { ISaleReceipt } from 'interfaces';
import { Transformer } from 'lib/Transformer/Transformer';
import { formatNumber } from 'utils';

@Service()
export default class SaleReceiptTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  protected includeAttributes = (): string[] => {
    return ['formattedAmount', 'formattedReceiptDate', 'formattedClosedAtDate'];
  };

  /**
   * Retrieve formatted receipt date.
   * @param {ISaleReceipt} invoice
   * @returns {String}
   */
  protected formattedReceiptDate = (receipt: ISaleReceipt): string => {
    return this.formatDate(receipt.receiptDate);
  };

  /**
   * Retrieve formatted estimate closed at date.
   * @param {ISaleReceipt} invoice
   * @returns {String}
   */
  protected formattedClosedAtDate = (receipt: ISaleReceipt): string => {
    return this.formatDate(receipt.closedAt);
  };

  /**
   * Retrieve formatted invoice amount.
   * @param {ISaleReceipt} estimate
   * @returns {string}
   */
  protected formattedAmount = (receipt: ISaleReceipt): string => {
    return formatNumber(receipt.amount, {
      currencyCode: receipt.currencyCode,
    });
  };
}
