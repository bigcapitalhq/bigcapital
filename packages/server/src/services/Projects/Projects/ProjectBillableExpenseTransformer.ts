import { IExpense } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class ProjectBillableExpenseTransformer extends Transformer {
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
   * Retrieves the billable type.
   * @returns {string}
   */
  public billableType = () => {
    return 'Expense';
  };

  /**
   * Retrieves the billable id.
   * @param {IExpense} expense
   * @returns {string}
   */
  public billableId = (expense: IExpense) => {
    return expense.id;
  };

  /**
   * Retrieves the billable amount of expense.
   * @param {IExpense} expense  -
   * @returns {number}
   */
  public billableAmount = (expense: IExpense) => {
    return expense.billableAmount;
  };

  /**
   * Retrieves the billable formatted amount of expense.
   * @param {IExpense} expense
   * @returns {string}
   */
  public billableAmountFormatted = (expense: IExpense) => {
    return formatNumber(expense.billableAmount, {
      currencyCode: expense.currencyCode,
    });
  };

  /**
   * Retrieves the currency of billable expense.
   * @param {IExpense} expense
   * @returns {string}
   */
  public billableCurrency = (expense: IExpense) => {
    return expense.currencyCode;
  };

  /**
   * Billable transaction number.
   * @returns {string}
   */
  public billableTransactionNo = () => {
    return '';
  };

  /**
   * Billable date.
   * @returns {Date}
   */
  public billableDate = (expense: IExpense) => {
    return expense.createdAt;
  };

  /**
   * Billable date formatted.
   * @returns {string}
   */
  public billableDateFormatted = (expense: IExpense) => {
    return this.formatDate(expense.createdAt);
  };
}
