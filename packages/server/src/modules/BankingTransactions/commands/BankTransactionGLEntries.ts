import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { BankTransaction } from '../models/BankTransaction';
import { BankTransactionGL } from './BankTransactionGL';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class BankTransactionGLEntriesService {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,

    @Inject(BankTransaction.name)
    private readonly bankTransactionModel: TenantModelProxy<typeof BankTransaction>,
  ) {}

  /**
   * Write the journal entries of the given cashflow transaction.
   * @param {ICashflowTransaction} cashflowTransaction
   * @return {Promise<void>}
   */
  public writeJournalEntries = async (
    cashflowTransactionId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Retrieves the cashflow transactions with associated entries.
    const transaction = await this.bankTransactionModel()
      .query(trx)
      .findById(cashflowTransactionId)
      .withGraphFetched('cashflowAccount')
      .withGraphFetched('creditAccount');

    // Retrieves the cashflow transaction ledger.
    const ledger = new BankTransactionGL(transaction).getCashflowLedger();

    await this.ledgerStorage.commit(ledger, trx);
  };

  /**
   * Delete the journal entries.
   * @param {number} cashflowTransactionId - Cashflow transaction id.
   * @return {Promise<void>}
   */
  public revertJournalEntries = async (
    cashflowTransactionId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    await this.ledgerStorage.deleteByReference(
      cashflowTransactionId,
      'CashflowTransaction',
      trx,
    );
  };
}
