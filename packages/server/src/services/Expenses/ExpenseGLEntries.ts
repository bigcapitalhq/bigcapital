import * as R from 'ramda';
import { Service } from 'typedi';
import {
  AccountNormal,
  IExpense,
  IExpenseCategory,
  ILedger,
  ILedgerEntry,
} from '@/interfaces';
import Ledger from '@/services/Accounting/Ledger';

@Service()
export class ExpenseGLEntries {
  /**
   * Retrieves the expense GL common entry.
   * @param {IExpense} expense
   * @returns
   */
  private getExpenseGLCommonEntry = (expense: IExpense) => {
    return {
      currencyCode: expense.currencyCode,
      exchangeRate: expense.exchangeRate,

      transactionType: 'Expense',
      transactionId: expense.id,

      date: expense.paymentDate,
      userId: expense.userId,

      debit: 0,
      credit: 0,

      branchId: expense.branchId,
    };
  };

  /**
   * Retrieves the expense GL payment entry.
   * @param   {IExpense} expense
   * @returns {ILedgerEntry}
   */
  private getExpenseGLPaymentEntry = (expense: IExpense): ILedgerEntry => {
    const commonEntry = this.getExpenseGLCommonEntry(expense);

    return {
      ...commonEntry,
      credit: expense.localAmount,
      accountId: expense.paymentAccountId,
      accountNormal: AccountNormal.DEBIT,
      index: 1,
    };
  };

  /**
   * Retrieves the expense GL category entry.
   * @param   {IExpense} expense -
   * @param   {IExpenseCategory} expenseCategory -
   * @param   {number} index
   * @returns {ILedgerEntry}
   */
  private getExpenseGLCategoryEntry = R.curry(
    (
      expense: IExpense,
      category: IExpenseCategory,
      index: number
    ): ILedgerEntry => {
      const commonEntry = this.getExpenseGLCommonEntry(expense);
      const localAmount = category.amount * expense.exchangeRate;

      return {
        ...commonEntry,
        accountId: category.expenseAccountId,
        accountNormal: AccountNormal.DEBIT,
        debit: localAmount,
        note: category.description,
        index: index + 2,
        projectId: category.projectId,
      };
    }
  );

  /**
   * Retrieves the expense GL entries.
   * @param   {IExpense} expense
   * @returns {ILedgerEntry[]}
   */
  public getExpenseGLEntries = (expense: IExpense): ILedgerEntry[] => {
    const getCategoryEntry = this.getExpenseGLCategoryEntry(expense);

    const paymentEntry = this.getExpenseGLPaymentEntry(expense);
    const categoryEntries = expense.categories.map(getCategoryEntry);

    return [paymentEntry, ...categoryEntries];
  };

  /**
   * Retrieves the given expense ledger.
   * @param   {IExpense} expense
   * @returns {ILedger}
   */
  public getExpenseLedger = (expense: IExpense): ILedger => {
    const entries = this.getExpenseGLEntries(expense);

    return new Ledger(entries);
  };
}
