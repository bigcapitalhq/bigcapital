import * as R from 'ramda';
import {
  AccountNormal,
  IExpenseCategory,
  ILedger,
  ILedgerEntry,
} from '@/interfaces';
import Ledger from '../Accounting/Ledger';

export class ExpenseGL {
  private expense: any;

  /**
   * Constructor method.
   */
  constructor(expense: any) {
    this.expense = expense;
  }

  /**
   * Retrieves the expense GL common entry.
   * @param {IExpense} expense
   * @returns {Partial<ILedgerEntry>}
   */
  private getExpenseGLCommonEntry = (): Partial<ILedgerEntry> => {
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
   * Retrieves the expense GL payment entry.
   * @param {IExpense} expense
   * @returns {ILedgerEntry}
   */
  private getExpenseGLPaymentEntry = (): ILedgerEntry => {
    const commonEntry = this.getExpenseGLCommonEntry();

    return {
      ...commonEntry,
      credit: this.expense.localAmount,
      accountId: this.expense.paymentAccountId,
      accountNormal:
        this.expense?.paymentAccount?.accountNormal === 'debit'
          ? AccountNormal.DEBIT
          : AccountNormal.CREDIT,
      index: 1,
    };
  };

  /**
   * Retrieves the expense GL category entry.
   * @param {IExpense} expense -
   * @param {IExpenseCategory} expenseCategory -
   * @param {number} index
   * @returns {ILedgerEntry}
   */
  private getExpenseGLCategoryEntry = R.curry(
    (category: IExpenseCategory, index: number): ILedgerEntry => {
      const commonEntry = this.getExpenseGLCommonEntry();
      const localAmount = category.amount * this.expense.exchangeRate;

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
   * @param {IExpense} expense
   * @returns {ILedgerEntry[]}
   */
  public getExpenseGLEntries = (): ILedgerEntry[] => {
    const getCategoryEntry = this.getExpenseGLCategoryEntry();

    const paymentEntry = this.getExpenseGLPaymentEntry();
    const categoryEntries = this.expense.categories.map(getCategoryEntry);

    return [paymentEntry, ...categoryEntries];
  };

  /**
   * Retrieves the given expense ledger.
   * @param {IExpense} expense
   * @returns {ILedger}
   */
  public getExpenseLedger = (): ILedger => {
    const entries = this.getExpenseGLEntries();

    console.log(entries, 'entries');

    return new Ledger(entries);
  };
}
