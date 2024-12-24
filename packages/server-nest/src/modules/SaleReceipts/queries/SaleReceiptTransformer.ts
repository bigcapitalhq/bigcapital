import { Transformer } from '@/modules/Transformer/Transformer';
import { SaleReceipt } from '../models/SaleReceipt';
import { ItemEntryTransformer } from '@/modules/TransactionItemEntry/ItemEntry.transformer';
import { AttachmentTransformer } from '@/modules/Attachments/Attachment.transformer';

export class SaleReceiptTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedSubtotal',
      'formattedAmount',
      'formattedReceiptDate',
      'formattedClosedAtDate',
      'formattedCreatedAt',
      'entries',
      'attachments',
    ];
  };

  /**
   * Retrieve formatted receipt date.
   * @param {ISaleReceipt} invoice
   * @returns {String}
   */
  protected formattedReceiptDate = (receipt: SaleReceipt): string => {
    return this.formatDate(receipt.receiptDate);
  };

  /**
   * Retrieve formatted estimate closed at date.
   * @param {ISaleReceipt} invoice
   * @returns {String}
   */
  protected formattedClosedAtDate = (receipt: SaleReceipt): string => {
    return this.formatDate(receipt.closedAt);
  };

  /**
   * Retrieve formatted receipt created at date.
   * @param receipt
   * @returns {string}
   */
  protected formattedCreatedAt = (receipt: SaleReceipt): string => {
    return this.formatDate(receipt.createdAt);
  };

  /**
   * Retrieves the estimate formatted subtotal.
   * @param {ISaleReceipt} receipt
   * @returns {string}
   */
  protected formattedSubtotal = (receipt: SaleReceipt): string => {
    return this.formatNumber(receipt.amount, { money: false });
  };

  /**
   * Retrieve formatted invoice amount.
   * @param {ISaleReceipt} estimate
   * @returns {string}
   */
  protected formattedAmount = (receipt: SaleReceipt): string => {
    return this.formatNumber(receipt.amount, {
      currencyCode: receipt.currencyCode,
    });
  };

  /**
   * Retrieves the entries of the credit note.
   * @param {ISaleReceipt} credit
   * @returns {}
   */
  // protected entries = (receipt: SaleReceipt) => {
  //   return this.item(receipt.entries, new ItemEntryTransformer(), {
  //     currencyCode: receipt.currencyCode,
  //   });
  // };

  /**
   * Retrieves the sale receipt attachments.
   * @param {SaleReceipt} receipt
   * @returns
   */
  // protected attachments = (receipt: SaleReceipt) => {
  //   return this.item(receipt.attachments, new AttachmentTransformer());
  // };
}
