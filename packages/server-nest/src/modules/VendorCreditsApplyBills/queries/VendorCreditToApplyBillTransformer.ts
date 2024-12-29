import { Bill } from '@/modules/Bills/models/Bill';
import { Transformer } from '@/modules/Transformer/Transformer';

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
   * @param {Bill} bill
   * @returns {String}
   */
  protected formattedBillDate = (bill: Bill): string => {
    return this.formatDate(bill.billDate);
  };

  /**
   * Retrieve formatted due date.
   * @param {Bill} bill
   * @returns {string}
   */
  protected formattedDueDate = (bill: Bill): string => {
    return this.formatDate(bill.dueDate);
  };

  /**
   * Retrieve formatted bill amount.
   * @param {Bill} bill
   * @returns {string}
   */
  protected formattedAmount = (bill: Bill): string => {
    return this.formatNumber(bill.amount, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieve formatted bill due amount.
   * @param {Bill} bill
   * @returns {string}
   */
  protected formattedDueAmount = (bill: Bill): string => {
    return this.formatNumber(bill.dueAmount, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieve formatted payment amount.
   * @param {Bill} bill
   * @returns {string}
   */
  protected formattedPaymentAmount = (bill: Bill): string => {
    return this.formatNumber(bill.paymentAmount, {
      currencyCode: bill.currencyCode,
    });
  };
}
