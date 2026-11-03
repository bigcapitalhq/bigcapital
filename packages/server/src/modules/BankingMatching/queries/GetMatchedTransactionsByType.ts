import { Knex } from 'knex';
import {
  GetMatchedTransactionsByTypeFilter,
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
  matchedBankTransactionModel: TenantModelProxy<typeof MatchedBankTransaction>;

  /**
   * Retrieves the matched transactions.
   * @param {GetMatchedTransactionsByTypeFilter} filter - Includes the accounts of the bank transactions.
   * @returns {Promise<MatchedTransactionsPOJO>}
   */
  public async getMatchedTransactions(
    _filter: GetMatchedTransactionsByTypeFilter,
  ): Promise<MatchedTransactionsPOJO> {
    throw new Error(
      'The `getMatchedTransactions` method is not defined for the transaction type.',
    );
  }

  /**
   * Retrieves the matched transaction details.
   * @param {number} transactionId -
   * @param {Array<number>} accountIds - Accounts of the bank transactions being matched.
   * @returns {Promise<MatchedTransactionPOJO>}
   */
  public async getMatchedTransaction(
    _transactionId: number,
    _accountIds: Array<number>,
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
    const creationResult = await PromisePool.withConcurrency(2)
      .for(uncategorizedTransactionIds)
      .process(async (uncategorizedTransactionId) => {
        await this.matchedBankTransactionModel().query(trx).insert({
          uncategorizedTransactionId,
          referenceType: matchTransactionDTO.referenceType,
          referenceId: matchTransactionDTO.referenceId,
        });
      });
    // Throws the first error to prevent partial matched transactions.
    if (creationResult.errors?.length > 0) {
      throw creationResult.errors[0].raw;
    }
  }
}
