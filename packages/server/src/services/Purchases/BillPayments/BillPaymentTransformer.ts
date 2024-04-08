import { IBillPayment } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from '../../../utils';
import { BillPaymentEntryTransformer } from './BillPaymentEntryTransformer';

export class BillPaymentTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['formattedPaymentDate', 'formattedAmount', 'entries'];
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
}
