import { IExpense } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from '../../../utils';
import { ExpenseCategoryTransformer } from './ExpenseCategoryTransformer';

export class ExpenseTransfromer extends Transformer {
  /**
   * Include these attributes to expense object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'formattedLandedCostAmount',
      'formattedAllocatedCostAmount',
      'formattedDate',
      'categories',
    ];
  };

  /**
   * Retrieve formatted expense amount.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedAmount = (expense: IExpense): string => {
    return formatNumber(expense.totalAmount, {
      currencyCode: expense.currencyCode,
    });
  };

  /**
   * Retrieve formatted expense landed cost amount.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedLandedCostAmount = (expense: IExpense): string => {
    return formatNumber(expense.landedCostAmount, {
      currencyCode: expense.currencyCode,
    });
  };

  /**
   * Retrieve formatted allocated cost amount.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedAllocatedCostAmount = (expense: IExpense): string => {
    return formatNumber(expense.allocatedCostAmount, {
      currencyCode: expense.currencyCode,
    });
  };

  /**
   * Retriecve fromatted date.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedDate = (expense: IExpense): string => {
    return this.formatDate(expense.paymentDate);
  };

  /**
   * Retrieves the transformed expense categories.
   * @param {IExpense} expense
   * @returns {}
   */
  protected categories = (expense: IExpense) => {
    return this.item(expense.categories, new ExpenseCategoryTransformer(), {
      currencyCode: expense.currencyCode,
    });
  };
}
