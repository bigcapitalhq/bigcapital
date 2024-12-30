import { castArray } from 'lodash';
import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { Ledger } from './Ledger';
import { LedgerStorageService } from './LedgerStorage.service';
import { AccountTransaction } from '../Accounts/models/AccountTransaction.model';

@Injectable()
export class LedgerRevertService {
  /**
   * @param ledgerStorage - Ledger storage service.
   * @param accountTransactionModel - Account transaction model.
   */
  constructor(
    private readonly ledgerStorage: LedgerStorageService,

    @Inject(AccountTransaction.name)
    private readonly accountTransactionModel: typeof AccountTransaction,
  ) {}

  /**
   * Reverts the jouranl entries.
   * @param {number|number[]} referenceId - Reference id.
   * @param {string} referenceType - Reference type.
   */
  public getTransactionsByReference = async (
    referenceId: number | number[],
    referenceType: string | string[],
  ) => {
    const transactions = await this.accountTransactionModel
      .query()
      .whereIn('reference_type', castArray(referenceType))
      .whereIn('reference_id', castArray(referenceId))
      .withGraphFetched('account');

    return transactions;
  };

  /**
   * Reverts the journal entries.
   * @param {number|number[]} referenceId - Reference id.
   * @param {string|string[]} referenceType - Reference type.
   * @param {Knex.Transaction} trx
   */
  public revertGLEntries = async (
    referenceId: number | number[],
    referenceType: string | string[],
    trx?: Knex.Transaction,
  ) => {
    // Gets the transactions by reference.
    const transactions = await this.getTransactionsByReference(
      referenceId,
      referenceType,
    );
    // Creates a new ledger from transaction and reverse the entries.
    const ledger = Ledger.fromTransactions(transactions);
    const reversedLedger = ledger.reverse();

    // Commits the reversed ledger.
    await this.ledgerStorage.commit(reversedLedger, trx);
  };
}
