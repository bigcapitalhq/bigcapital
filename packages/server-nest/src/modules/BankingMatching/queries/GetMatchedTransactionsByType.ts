import { Knex } from 'knex';
import {
  GetMatchedTransactionsFilter,
  IMatchTransactionDTO,
  MatchedTransactionPOJO,
  MatchedTransactionsPOJO,
} from '../types';
import PromisePool from '@supercharge/promise-pool';
import { MatchedBankTransaction } from '../models/MatchedBankTransaction';
import { Inject } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

export abstract class GetMatchedTransactionsByType {
  @Inject(MatchedBankTransaction.name)
  private readonly matchedBankTransactionModel: TenantModelProxy<
    typeof MatchedBankTransaction
  >;

  /**
   * Retrieves the matched transactions.
   * @param {number} tenantId -
   * @param {GetMatchedTransactionsFilter} filter -
   * @returns {Promise<MatchedTransactionsPOJO>}
   */
  public async getMatchedTransactions(
    filter: GetMatchedTransactionsFilter,
  ): Promise<MatchedTransactionsPOJO> {
    throw new Error(
      'The `getMatchedTransactions` method is not defined for the transaction type.',
    );
  }

  /**
   * Retrieves the matched transaction details.
   * @param {number} tenantId -
   * @param {number} transactionId -
   * @returns {Promise<MatchedTransactionPOJO>}
   */
  public async getMatchedTransaction(
    transactionId: number,
  ): Promise<MatchedTransactionPOJO> {
    throw new Error(
      'The `getMatchedTransaction` method is not defined for the transaction type.',
    );
  }

  /**
   * Creates the common matched transaction.
   * @param {number} tenantId
   * @param {Array<number>} uncategorizedTransactionIds
   * @param {IMatchTransactionDTO} matchTransactionDTO
   * @param {Knex.Transaction} trx
   */
  public async createMatchedTransaction(
    uncategorizedTransactionIds: Array<number>,
    matchTransactionDTO: IMatchTransactionDTO,
    trx?: Knex.Transaction,
  ) {
    await PromisePool.withConcurrency(2)
      .for(uncategorizedTransactionIds)
      .process(async (uncategorizedTransactionId) => {
        await this.matchedBankTransactionModel().query(trx).insert({
          uncategorizedTransactionId,
          referenceType: matchTransactionDTO.referenceType,
          referenceId: matchTransactionDTO.referenceId,
        });
      });
  }
}
