import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { ExpenseGLEntries } from './ExpenseGLEntries';

@Service()
export class ExpenseGLEntriesStorage {
  @Inject()
  private expenseGLEntries: ExpenseGLEntries;

  @Inject()
  private ledgerStorage: LedgerStorageService;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Writes the expense GL entries.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {Knex.Transaction} trx
   */
  public writeExpenseGLEntries = async (tenantId: number, expenseId: number, trx?: Knex.Transaction) => {
    const { Expense } = await this.tenancy.models(tenantId);

    const expense = await Expense.query(trx).findById(expenseId).withGraphFetched('categories');

    // Retrieves the given expense ledger.
    const expenseLedger = this.expenseGLEntries.getExpenseLedger(expense);

    // Commits the expense ledger entries.
    await this.ledgerStorage.commit(tenantId, expenseLedger, trx);
  };

  /**
   * Reverts the given expense GL entries.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {Knex.Transaction} trx
   */
  public revertExpenseGLEntries = async (tenantId: number, expenseId: number, trx?: Knex.Transaction) => {
    await this.ledgerStorage.deleteByReference(tenantId, expenseId, 'Expense', trx);
  };

  /**
   * Rewrites the expense GL entries.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {Knex.Transaction} trx
   */
  public rewriteExpenseGLEntries = async (tenantId: number, expenseId: number, trx?: Knex.Transaction) => {
    // Reverts the expense GL entries.
    await this.revertExpenseGLEntries(tenantId, expenseId, trx);

    // Writes the expense GL entries.
    await this.writeExpenseGLEntries(tenantId, expenseId, trx);
  };
}
