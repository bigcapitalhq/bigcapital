import { Service } from 'typedi';
import { ISaleReceipt } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';
import { ItemEntryTransformer } from '../Invoices/ItemEntryTransformer';
import { AttachmentTransformer } from '@/services/Attachments/AttachmentTransformer';

@Service()
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
   * Retrieve formatted receipt created at date.
   * @param receipt 
   * @returns {string}
   */
  protected formattedCreatedAt = (receipt: ISaleReceipt): string => {
    return this.formatDate(receipt.createdAt);
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

  /**
   * Retrieves the sale receipt attachments.
   * @param {ISaleReceipt} invoice
   * @returns
   */
  protected attachments = (receipt) => {
    return this.item(receipt.attachments, new AttachmentTransformer());
  };
}
