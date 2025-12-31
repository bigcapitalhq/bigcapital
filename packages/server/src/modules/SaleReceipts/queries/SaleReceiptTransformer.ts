import { Transformer } from '@/modules/Transformer/Transformer';
import { SaleReceipt } from '../models/SaleReceipt';
import { ItemEntryTransformer } from '@/modules/TransactionItemEntry/ItemEntry.transformer';
import { AttachmentTransformer } from '@/modules/Attachments/Attachment.transformer';
import { SaleInvoiceTaxEntryTransformer } from '@/modules/SaleInvoices/queries/SaleInvoiceTaxEntry.transformer';

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
      'subtotalFormatted',
      'subtotalLocalFormatted',
      'totalFormatted',
      'totalLocalFormatted',

      'discountAmountFormatted',
      'discountPercentageFormatted',
      'adjustmentFormatted',

      'taxAmountWithheldFormatted',
      'taxes',

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
   * Retrieves the formatted subtotal.
   */
  protected subtotalFormatted = (receipt: SaleReceipt): string => {
    return this.formatNumber(receipt.subtotal, { money: false });
  };

  /**
   * Retrieves the estimate formatted subtotal in local currency.
   * @param {ISaleReceipt} receipt
   * @returns {string}
   */
  protected subtotalLocalFormatted = (receipt: SaleReceipt): string => {
    return this.formatNumber(receipt.subtotalLocal, {
      currencyCode: receipt.currencyCode,
    });
  };

  /**
   * Retrieves the receipt formatted total.
   * @returns {string}
   */
  protected totalFormatted = (receipt: SaleReceipt): string => {
    return this.formatNumber(receipt.total, { money: false });
  };

  /**
   * Retrieves the receipt formatted total in local currency.
   * @returns {string}
   */
  protected totalLocalFormatted = (receipt: SaleReceipt): string => {
    return this.formatNumber(receipt.totalLocal, { money: false });
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
   * Retrieves formatted discount amount.
   * @returns {string}
   */
  protected discountAmountFormatted = (receipt: SaleReceipt): string => {
    return this.formatNumber(receipt.discountAmount, {
      currencyCode: receipt.currencyCode,
    });
  };

  /**
   * Retrieves formatted discount percentage.
   * @returns {string}
   */
  protected discountPercentageFormatted = (receipt: SaleReceipt): string => {
    return receipt.discountPercentage ? `${receipt.discountPercentage}%` : '';
  };

  /**
   * Retrieves formatted adjustment amount.
   * @returns {string}
   */
  protected adjustmentFormatted = (receipt: SaleReceipt): string => {
    return this.formatMoney(receipt.adjustment, {
      currencyCode: receipt.currencyCode,
    });
  };

  /**
   * Retrieves the entries of the sale receipt.
   * @param {SaleReceipt} receipt
   * @returns {}
   */
  protected entries = (receipt: SaleReceipt) => {
    return this.item(receipt.entries, new ItemEntryTransformer(), {
      currencyCode: receipt.currencyCode,
    });
  };

  /**
   * Retrieves the sale receipt attachments.
   * @param {SaleReceipt} receipt
   * @returns
   */
  protected attachments = (receipt: SaleReceipt) => {
    return this.item(receipt.attachments, new AttachmentTransformer());
  };

  /**
   * Retrieves formatted tax amount withheld.
   * @param receipt
   * @returns {string}
   */
  protected taxAmountWithheldFormatted = (receipt: SaleReceipt): string => {
    return this.formatNumber(receipt.taxAmountWithheld, {
      currencyCode: receipt.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the sale receipt taxes.
   * @param {SaleReceipt} receipt
   * @returns
   */
  protected taxes = (receipt: SaleReceipt) => {
    return this.item(receipt.taxes, new SaleInvoiceTaxEntryTransformer(), {
      subtotal: receipt.subtotal,
      isInclusiveTax: receipt.isInclusiveTax,
      currencyCode: receipt.currencyCode,
    });
  };
}
