import { Service } from 'typedi';
import { isEmpty } from 'lodash';
import * as R from 'ramda';
import {
  IExpense,
  ILandedCostTransactionEntry,
  IExpenseCategory,
  IAccount,
  ILandedCostTransaction,
} from '@/interfaces';

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
    const name = 'EXP-100';

    return {
      id: expense.id,
      name,
      amount: expense.landedCostAmount,
      allocatedCostAmount: expense.allocatedCostAmount,
      unallocatedCostAmount: expense.unallocatedCostAmount,
      transactionType: 'Expense',
      currencyCode: expense.currencyCode,
      exchangeRate: expense.exchangeRate || 1,

      ...(!isEmpty(expense.categories) && {
        entries: expense.categories.map(this.transformToLandedCostEntry),
      }),
    };
  };

  /**
   * Transforms expense entry to landed cost entry.
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
      allocatedCostAmount: expenseEntry.allocatedCostAmount,
      unallocatedCostAmount: expenseEntry.unallocatedCostAmount,
      costAccountId: expenseEntry.expenseAccount.id,
    };
  };
}
