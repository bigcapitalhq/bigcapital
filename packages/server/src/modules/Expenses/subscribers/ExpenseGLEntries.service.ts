import { Knex } from 'knex';
import { ExpenseGL } from './ExpenseGL';
import { Inject, Injectable } from '@nestjs/common';
import { Expense } from '../models/Expense.model';
import { ILedger } from '@/modules/Ledger/types/Ledger.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class ExpenseGLEntriesService {
  /**
   * @param {TenantModelProxy<typeof Expense>} expense - Expense model.
   */
  constructor(
    @Inject(Expense.name)
    private readonly expense: TenantModelProxy<typeof Expense>,
  ) {}

  /**
   * Retrieves the expense G/L of the given id.
   * @param {number} expenseId
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<ILedger>}
   */
  public getExpenseLedgerById = async (
    expenseId: number,
    trx?: Knex.Transaction,
  ): Promise<ILedger> => {
    const expense = await this.expense()
      .query(trx)
      .findById(expenseId)
      .withGraphFetched('categories')
      .withGraphFetched('paymentAccount')
      .throwIfNotFound();

    return this.getExpenseLedger(expense);
  };

  /**
   * Retrieves the given expense ledger.
   * @param {Expense} expense - Expense model.
   * @returns {ILedger}
   */
  public getExpenseLedger = (expense: Expense): ILedger => {
    const expenseGL = new ExpenseGL(expense);

    return expenseGL.getExpenseLedger();
  };
}
