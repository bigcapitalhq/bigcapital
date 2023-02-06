import { IBill } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class ProjectBillableBillTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'billableType',
      'billableId',
      'billableAmount',
      'billableAmountFormatted',
      'billableCurrency',
      'billableTransactionNo',
      'billableDate',
      'billableDateFormatted',
    ];
  };

  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Billable type.
   * @returns {string}
   */
  public billableType = () => {
    return 'Bill';
  };

  /**
   * Billable id.
   * @param {IBill} bill
   * @returns {string}
   */
  public billableId = (bill: IBill) => {
    return bill.id;
  };

  /**
   * Billable amount.
   * @param {IBill} bill
   * @returns {string}
   */
  public billableAmount = (bill: IBill) => {
    return bill.billableAmount;
  };

  /**
   * Billable amount formatted.
   * @param {IBill} bill
   * @returns {string}
   */
  public billableAmountFormatted = (bill: IBill) => {
    return formatNumber(bill.billableAmount, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Billable currency.
   * @param {IBill} bill
   * @returns {string}
   */
  public billableCurrency = (bill: IBill) => {
    return bill.currencyCode;
  };

  /**
   *
   * @param {IBill} bill
   * @returns {string}
   */
  public billableTransactionNo = (bill: IBill) => {
    return bill.billNumber;
  };

  /**
   * Billable date.
   * @returns {Date}
   */
  public billableDate = (bill: IBill) => {
    return bill.createdAt;
  };

  /**
   * Billable date formatted.
   * @returns {string}
   */
  public billableDateFormatted = (bill: IBill) => {
    return this.formatDate(bill.createdAt);
  };
}
