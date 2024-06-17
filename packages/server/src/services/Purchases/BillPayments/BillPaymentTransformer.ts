import { IBillPayment } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';
import { BillPaymentEntryTransformer } from './BillPaymentEntryTransformer';
import { AttachmentTransformer } from '@/services/Attachments/AttachmentTransformer';

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
      'entries',
      'attachments',
    ];
  };

  /**
   * Retrieve formatted invoice date.
   * @param {IBill} invoice
   * @returns {String}
   */
  protected formattedPaymentDate = (billPayment: IBillPayment): string => {
    return this.formatDate(billPayment.paymentDate);
  };

  /**
   * Retrieve formatted created at date.
   * @param {IBillPayment} billPayment 
   * @returns {string}
   */
  protected formattedCreatedAt = (billPayment: IBillPayment): string => {
    return this.formatDate(billPayment.createdAt);
  }

  /**
   * Retrieve formatted bill amount.
   * @param {IBill} invoice
   * @returns {string}
   */
  protected formattedAmount = (billPayment: IBillPayment): string => {
    return formatNumber(billPayment.amount, {
      currencyCode: billPayment.currencyCode,
    });
  };

  /**
   * Retreives the bill payment entries.
   */
  protected entries = (billPayment) => {
    return this.item(billPayment.entries, new BillPaymentEntryTransformer());
  };

  /**
   * Retrieves the bill attachments.
   * @param {ISaleInvoice} invoice
   * @returns
   */
  protected attachments = (billPayment) => {
    return this.item(billPayment.attachments, new AttachmentTransformer());
  };
}
