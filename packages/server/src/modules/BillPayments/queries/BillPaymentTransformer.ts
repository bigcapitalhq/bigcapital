import { BillPaymentEntryTransformer } from './BillPaymentEntry.transformer';
import { Transformer } from '@/modules/Transformer/Transformer';
import { BillPayment } from '../models/BillPayment';
import { AttachmentTransformer } from '@/modules/Attachments/Attachment.transformer';

export class BillPaymentTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedPaymentDate',
      'formattedCreatedAt',
      'formattedAmount',
      'formattedTotal',
      'formattedSubtotal',
      'entries',
      'attachments',
    ];
  };

  /**
   * Retrieve formatted invoice date.
   * @param {IBill} invoice
   * @returns {String}
   */
  protected formattedPaymentDate = (billPayment: BillPayment): string => {
    return this.formatDate(billPayment.paymentDate);
  };

  /**
   * Retrieve formatted created at date.
   * @param {IBillPayment} billPayment
   * @returns {string}
   */
  protected formattedCreatedAt = (billPayment: BillPayment): string => {
    return this.formatDate(billPayment.createdAt);
  };

  /**
   * Retrieve formatted bill amount.
   * @param {IBill} invoice
   * @returns {string}
   */
  protected formattedAmount = (billPayment: BillPayment): string => {
    return this.formatNumber(billPayment.amount, {
      currencyCode: billPayment.currencyCode,
    });
  };

  /**
   * Retrieves the formatted total.
   * @param {IBillPayment} billPayment
   * @returns {string}
   */
  protected formattedTotal = (billPayment: BillPayment): string => {
    return this.formatNumber(billPayment.amount, {
      currencyCode: billPayment.currencyCode,
      money: true,
    });
  };

  /**
   * Retrieves the formatted subtotal.
   * @param {IBillPayment} billPayment
   * @returns {string}
   */
  protected formattedSubtotal = (billPayment: BillPayment): string => {
    return this.formatNumber(billPayment.amount, {
      currencyCode: billPayment.currencyCode,
    });
  };

  /**
   * Retreives the bill payment entries.
   */
  protected entries = (billPayment: BillPayment) => {
    return this.item(billPayment.entries, new BillPaymentEntryTransformer());
  };

  /**
   * Retrieves the bill attachments.
   * @param {ISaleInvoice} invoice
   * @returns
   */
  protected attachments = (billPayment: BillPayment) => {
    return this.item(billPayment.attachments, new AttachmentTransformer());
  };
}
