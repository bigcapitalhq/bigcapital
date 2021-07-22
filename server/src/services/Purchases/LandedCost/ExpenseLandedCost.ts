import { Service } from 'typedi';
import { isEmpty } from 'lodash';
import {
  IExpense,
  ILandedCostTransactionEntry,
  IExpenseCategory,
  IAccount,
  ILandedCostTransaction,
} from 'interfaces';

@Service()
export default class ExpenseLandedCost {
  /**
   * Retrieve the landed cost transaction from the given expense transaction.
   * @param {IExpense} expense
   * @returns {ILandedCostTransaction}
   */
  public transformToLandedCost = (
    expense: IExpense
  ): ILandedCostTransaction => {
    const name = [expense.currencyCode + ' ' + expense.totalAmount].join(' - ');

    return {
      id: expense.id,
      name,
      allocatedCostAmount: expense.allocatedCostAmount,
      amount: expense.landedCostAmount,
      unallocatedCostAmount: expense.unallocatedCostAmount,
      transactionType: 'Expense',

      ...(!isEmpty(expense.categories) && {
        entries: expense.categories.map(this.transformToLandedCostEntry),
      }),
    };
  };

  /**
   * Transformes expense entry to landed cost entry.
   * @param {IExpenseCategory & { expenseAccount: IAccount }} expenseEntry -
   * @return {ILandedCostTransactionEntry}
   */
  public transformToLandedCostEntry = (
    expenseEntry: IExpenseCategory & { expenseAccount: IAccount }
  ): ILandedCostTransactionEntry => {
    return {
      id: expenseEntry.id,
      name: expenseEntry.expenseAccount.name,
      code: expenseEntry.expenseAccount.code,
      amount: expenseEntry.amount,
      description: expenseEntry.description,
    };
  };
}
