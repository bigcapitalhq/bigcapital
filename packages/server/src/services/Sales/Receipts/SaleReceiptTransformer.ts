import { ISaleReceipt } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { Service } from 'typedi';
import { formatNumber } from '../../../utils';
import { ItemEntryTransformer } from '../Invoices/ItemEntryTransformer';

@Service()
export class SaleReceiptTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['formattedSubtotal', 'formattedAmount', 'formattedReceiptDate', 'formattedClosedAtDate', 'entries'];
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
   * Retrieves the estimate formatted subtotal.
   * @param {ISaleReceipt} receipt
   * @returns {string}
   */
  protected formattedSubtotal = (receipt: ISaleReceipt): string => {
    return formatNumber(receipt.amount, { money: false });
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

  /**
   * Retrieves the entries of the credit note.
   * @param {ISaleReceipt} credit
   * @returns {}
   */
  protected entries = (receipt) => {
    return this.item(receipt.entries, new ItemEntryTransformer(), {
      currencyCode: receipt.currencyCode,
    });
  };
}
