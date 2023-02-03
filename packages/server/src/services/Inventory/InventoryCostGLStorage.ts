import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import Ledger from '@/services/Accounting/Ledger';

@Service()
export class InventoryCostGLStorage {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private ledgerStorage: LedgerStorageService;

  /**
   * Reverts the inventory cost GL entries from the given starting date.
   * @param {number} tenantId
   * @param {Date} startingDate
   * @param {Knex.Transaction} trx
   */
  public revertInventoryCostGLEntries = async (
    tenantId: number,
    startingDate: Date,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    // Retrieve transactions from specific date range and costable transactions only.
    const transactions = await AccountTransaction.query()
      .where('costable', true)
      .modify('filterDateRange', startingDate)
      .withGraphFetched('account');

    // Transform transaction to ledger entries and reverse them.
    const reversedLedger = Ledger.fromTransactions(transactions).reverse();

    // Deletes and reverts balances of the given ledger.
    await this.ledgerStorage.delete(tenantId, reversedLedger, trx);
  };
}
