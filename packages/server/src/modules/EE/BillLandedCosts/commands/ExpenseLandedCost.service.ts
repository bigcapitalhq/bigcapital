import { Expense } from '@/modules/Expenses/models/Expense.model';
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ModelObject } from 'objection';
import {
  ILandedCostTransaction,
  ILandedCostTransactionEntry,
} from '../types/BillLandedCosts.types';
import { ExpenseCategory } from '@/modules/Expenses/models/ExpenseCategory.model';
import { Account } from '@/modules/Accounts/models/Account.model';

@Injectable()
export class ExpenseLandedCost {
  /**
   * Retrieve the landed cost transaction from the given expense transaction.
   * @param {IExpense} expense
   * @returns {ILandedCostTransaction}
   */
  public transformToLandedCost = (
    expense: ModelObject<Expense>,
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
   * Transformes expense entry to landed cost entry.
   * @param {IExpenseCategory & { expenseAccount: IAccount }} expenseEntry -
   * @return {ILandedCostTransactionEntry}
   */
  public transformToLandedCostEntry = (
    expenseEntry: ExpenseCategory & { expenseAccount: Account },
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
