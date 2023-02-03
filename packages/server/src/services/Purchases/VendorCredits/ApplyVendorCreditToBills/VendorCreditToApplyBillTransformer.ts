import { IBill } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class VendorCreditToApplyBillTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedBillDate',
      'formattedDueDate',
      'formattedAmount',
      'formattedDueAmount',
      'formattedPaymentAmount',
    ];
  };

  /**
   * Retrieve formatted bill date.
   * @param {IBill} bill
   * @returns {String}
   */
  protected formattedBillDate = (bill: IBill): string => {
    return this.formatDate(bill.billDate);
  };

  /**
   * Retrieve formatted due date.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedDueDate = (bill: IBill): string => {
    return this.formatDate(bill.dueDate);
  };

  /**
   * Retrieve formatted bill amount.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedAmount = (bill: IBill): string => {
    return formatNumber(bill.amount, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieve formatted bill due amount.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedDueAmount = (bill: IBill): string => {
    return formatNumber(bill.dueAmount, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieve formatted payment amount.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedPaymentAmount = (bill: IBill): string => {
    return formatNumber(bill.paymentAmount, {
      currencyCode: bill.currencyCode,
    });
  };
}
