import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { LedgerStorageService } from '../Ledger/LedgerStorage.service';
import { Ledger } from '../Ledger/Ledger';
import { AccountTransaction } from '../Accounts/models/AccountTransaction.model';

@Injectable()
export class InventoryCostGLStorage {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,

    @Inject(AccountTransaction.name)
    private readonly accountTransactionModel: typeof AccountTransaction,
  ) {}

  /**
   * Reverts the inventory cost GL entries from the given starting date.
   * @param {Date} startingDate - Starting date.
   * @param {Knex.Transaction} trx - Transaction.
   */
  public async revertInventoryCostGLEntries(
    startingDate: Date,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Retrieve transactions from specific date range and costable transactions only.
    const transactions = await this.accountTransactionModel
      .query()
      .where('costable', true)
      .modify('filterDateRange', startingDate)
      .withGraphFetched('account');

    // Transform transaction to ledger entries and reverse them.
    const reversedLedger = Ledger.fromTransactions(transactions).reverse();

    // Deletes and reverts balances of the given ledger.
    await this.ledgerStorage.delete(reversedLedger, trx);
  }
}
