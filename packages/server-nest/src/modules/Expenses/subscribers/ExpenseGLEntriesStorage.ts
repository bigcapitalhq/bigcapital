import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ExpenseGLEntries } from './ExpenseGLEntriesService';

@Service()
export class ExpenseGLEntriesStorage {
  @Inject()
  private expenseGLEntries: ExpenseGLEntries;

  @Inject()
  private ledgerStorage: LedgerStorageService;

  /**
   * Writes the expense GL entries.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {Knex.Transaction} trx
   */
  public writeExpenseGLEntries = async (
    tenantId: number,
    expenseId: number,
    trx?: Knex.Transaction
  ) => {
    // Retrieves the given expense ledger.
    const expenseLedger = await this.expenseGLEntries.getExpenseLedgerById(
      tenantId,
      expenseId,
      trx
    );
    // Commits the expense ledger entries.
    await this.ledgerStorage.commit(tenantId, expenseLedger, trx);
  };

  /**
   * Reverts the given expense GL entries.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {Knex.Transaction} trx
   */
  public revertExpenseGLEntries = async (
    tenantId: number,
    expenseId: number,
    trx?: Knex.Transaction
  ) => {
    await this.ledgerStorage.deleteByReference(
      tenantId,
      expenseId,
      'Expense',
      trx
    );
  };

  /**
   * Rewrites the expense GL entries.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {Knex.Transaction} trx
   */
  public rewriteExpenseGLEntries = async (
    tenantId: number,
    expenseId: number,
    trx?: Knex.Transaction
  ) => {
    // Reverts the expense GL entries.
    await this.revertExpenseGLEntries(tenantId, expenseId, trx);

    // Writes the expense GL entries.
    await this.writeExpenseGLEntries(tenantId, expenseId, trx);
  };
}
