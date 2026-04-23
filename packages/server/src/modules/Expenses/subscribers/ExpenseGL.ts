import * as R from 'ramda';
import { ILedger } from '@/modules/Ledger/types/Ledger.types';
import { AccountNormal } from '@/modules/Accounts/Accounts.types';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { ExpenseCategory } from '../models/ExpenseCategory.model';
import { ExpensePaymentSplit } from '../models/ExpensePaymentSplit.model';
import { Ledger } from '@/modules/Ledger/Ledger';
import { Expense } from '../models/Expense.model';

export class ExpenseGL {
  private expense: Expense;

  /**
   * Constructor method.
   * @param {Expense} expense - Expense.
   */
  constructor(expense: Expense) {
    this.expense = expense;
  }

  /**
   * Retrieves the expense GL common entry.
   */
  private getExpenseGLCommonEntry = () => {
    return {
      currencyCode: this.expense.currencyCode,
      exchangeRate: this.expense.exchangeRate,

      transactionType: 'Expense',
      transactionId: this.expense.id,

      date: this.expense.paymentDate,
      userId: this.expense.userId,

      debit: 0,
      credit: 0,

      branchId: this.expense.branchId,
    };
  };

  /**
   * Retrieves the expense GL payment entries — one credit per payment split.
   * Callers must eager-fetch `paymentSplits.paymentAccount`; the only
   * production caller is `ExpenseGLEntriesService.getExpenseLedgerById`.
   * @returns {ILedgerEntry[]}
   */
  private getExpenseGLPaymentEntries = (): ILedgerEntry[] => {
    const commonEntry = this.getExpenseGLCommonEntry();
    const exchangeRate = this.expense.exchangeRate;
    const splits: ExpensePaymentSplit[] = this.expense.paymentSplits || [];

    return splits.map((split, index) => ({
      ...commonEntry,
      credit: split.amount * exchangeRate,
      accountId: split.paymentAccountId,
      accountNormal:
        split.paymentAccount?.accountNormal === 'debit'
          ? AccountNormal.DEBIT
          : AccountNormal.CREDIT,
      index: index + 1,
    }));
  };

  /**
   * Retrieves the expense GL category entry.
   * @param {ExpenseCategory} category - Expense category.
   * @param {number} index
   * @returns {ILedgerEntry}
   */
  private getExpenseGLCategoryEntry = R.curry(
    (
      category: ExpenseCategory,
      index: number,
      indexOffset: number,
    ): ILedgerEntry => {
      const commonEntry = this.getExpenseGLCommonEntry();
      const localAmount = category.amount * this.expense.exchangeRate;

      return {
        ...commonEntry,
        accountId: category.expenseAccountId,
        accountNormal: AccountNormal.DEBIT,
        debit: localAmount,
        note: category.description,
        index: index + indexOffset,
        projectId: category.projectId,
      };
    },
  );

  /**
   * Retrieves the expense GL entries.
   * @returns {ILedgerEntry[]}
   */
  public getExpenseGLEntries = (): ILedgerEntry[] => {
    const getCategoryEntry = this.getExpenseGLCategoryEntry();

    const paymentEntries = this.getExpenseGLPaymentEntries();
    const indexOffset = paymentEntries.length + 1;
    const categoryEntries = this.expense.categories.map((category, index) =>
      getCategoryEntry(category, index, indexOffset),
    );
    return [...paymentEntries, ...categoryEntries];
  };

  /**
   * Retrieves the given expense ledger.
   * @returns {ILedger}
   */
  public getExpenseLedger = (): ILedger => {
    const entries = this.getExpenseGLEntries();

    return new Ledger(entries);
  };
}
