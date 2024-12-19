import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { IExpense, ILedger } from '@/interfaces';
import { ExpenseGL } from './ExpenseGL';
import HasTenancyService from '../Tenancy/TenancyService';

@Service()
export class ExpenseGLEntries {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the expense G/L of the given id.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {Knex.Transaction} trx
   * @returns {Promise<ILedger>}
   */
  public getExpenseLedgerById = async (
    tenantId: number,
    expenseId: number,
    trx?: Knex.Transaction
  ): Promise<ILedger> => {
    const { Expense } = await this.tenancy.models(tenantId);

    const expense = await Expense.query(trx)
      .findById(expenseId)
      .withGraphFetched('categories')
      .withGraphFetched('paymentAccount')
      .throwIfNotFound();

    return this.getExpenseLedger(expense);
  };

  /**
   * Retrieves the given expense ledger.
   * @param {IExpense} expense
   * @returns {ILedger}
   */
  public getExpenseLedger = (expense: IExpense): ILedger => {
    const expenseGL = new ExpenseGL(expense);

    return expenseGL.getExpenseLedger();
  };
}
