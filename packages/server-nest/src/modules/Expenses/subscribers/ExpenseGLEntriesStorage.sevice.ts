import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { ExpenseGLEntriesService } from './ExpenseGLEntries.service';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';

@Injectable()
export class ExpenseGLEntriesStorageService {
  /**
   * @param {ExpenseGLEntriesService} expenseGLEntries - Expense GL entries service.
   * @param {LedgerStorageService} ledgerStorage - Ledger storage service.
   */
  constructor(
    private readonly expenseGLEntries: ExpenseGLEntriesService,
    private readonly ledgerStorage: LedgerStorageService,
  ) {}

  /**
   * Writes the expense GL entries.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {Knex.Transaction} trx
   */
  public writeExpenseGLEntries = async (
    expenseId: number,
    trx?: Knex.Transaction,
  ) => {
    // Retrieves the given expense ledger.
    const expenseLedger = await this.expenseGLEntries.getExpenseLedgerById(
      expenseId,
      trx,
    );
    // Commits the expense ledger entries.
    await this.ledgerStorage.commit(expenseLedger, trx);
  };

  /**
   * Reverts the given expense GL entries.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {Knex.Transaction} trx
   */
  public revertExpenseGLEntries = async (
    expenseId: number,
    trx?: Knex.Transaction,
  ) => {
    await this.ledgerStorage.deleteByReference(
      expenseId,
      'Expense',
      trx,
    );
  };

  /**
   * Rewrites the expense GL entries.
   * @param {number} expenseId
   * @param {Knex.Transaction} trx
   */
  public rewriteExpenseGLEntries = async (
    expenseId: number,
    trx?: Knex.Transaction,
  ) => {
    // Reverts the expense GL entries.
    await this.revertExpenseGLEntries(expenseId, trx);

    // Writes the expense GL entries.
    await this.writeExpenseGLEntries(expenseId, trx);
  };
}
