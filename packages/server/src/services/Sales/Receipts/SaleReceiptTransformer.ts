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
      'discountAmountFormatted',
      'discountPercentageFormatted',
      'discountAmountLocalFormatted',

      'subtotalFormatted',
      'subtotalLocalFormatted',

      'totalFormatted',
      'totalLocalFormatted',

      'adjustmentFormatted',
      'adjustmentLocalFormatted',

      'formattedAmount',
      'formattedReceiptDate',
      'formattedClosedAtDate',
      'formattedCreatedAt',
      'paidFormatted',
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
  protected subtotalFormatted = (receipt: ISaleReceipt): string => {
    return formatNumber(receipt.subtotal, {
      currencyCode: receipt.currencyCode,
    });
  };

  /**
   * Retrieves the estimate formatted subtotal in local currency.
   * @param {ISaleReceipt} receipt
   * @returns {string}
   */
  protected subtotalLocalFormatted = (receipt: ISaleReceipt): string => {
    return formatNumber(receipt.subtotalLocal, {
      currencyCode: receipt.currencyCode,
    });
  };

  /**
   * Retrieves the receipt formatted total.
   * @param receipt
   * @returns {string}
   */
  protected totalFormatted = (receipt: ISaleReceipt): string => {
    return formatNumber(receipt.total, { currencyCode: receipt.currencyCode });
  };

  /**
   * Retrieves the receipt formatted total in local currency.
   * @param receipt
   * @returns {string}
   */
  protected totalLocalFormatted = (receipt: ISaleReceipt): string => {
    return formatNumber(receipt.totalLocal, {
      currencyCode: receipt.currencyCode,
    });
  };

  /**
   * Retrieve formatted invoice amount.
   * @param {ISaleReceipt} estimate
   * @returns {string}
   */
  protected amountFormatted = (receipt: ISaleReceipt): string => {
    return formatNumber(receipt.amount, {
      currencyCode: receipt.currencyCode,
    });
  };

  /**
   * Retrieves formatted discount amount.
   * @param receipt
   * @returns {string}
   */
  protected discountAmountFormatted = (receipt: ISaleReceipt): string => {
    return formatNumber(receipt.discountAmount, {
      currencyCode: receipt.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves formatted discount percentage.
   * @param receipt
   * @returns {string}
   */
  protected discountPercentageFormatted = (receipt: ISaleReceipt): string => {
    return receipt.discountPercentage ? `${receipt.discountPercentage}%` : '';
  };

  /**
   * Retrieves formatted paid amount.
   * @param receipt
   * @returns {string}
   */
  protected paidFormatted = (receipt: ISaleReceipt): string => {
    return formatNumber(receipt.paid, {
      currencyCode: receipt.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves formatted adjustment amount.
   * @param receipt
   * @returns {string}
   */
  protected adjustmentFormatted = (receipt: ISaleReceipt): string => {
    return this.formatMoney(receipt.adjustment, {
      currencyCode: receipt.currencyCode,
      excerptZero: true,
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
