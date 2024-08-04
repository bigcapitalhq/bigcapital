import { Knex } from 'knex';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  GetMatchedTransactionsFilter,
  IMatchTransactionDTO,
  MatchedTransactionPOJO,
  MatchedTransactionsPOJO,
} from './types';
import { Inject, Service } from 'typedi';
import PromisePool from '@supercharge/promise-pool';

export abstract class GetMatchedTransactionsByType {
  @Inject()
  protected tenancy: HasTenancyService;

  /**
   * Retrieves the matched transactions.
   * @param {number} tenantId -
   * @param {GetMatchedTransactionsFilter} filter -
   * @returns {Promise<MatchedTransactionsPOJO>}
   */
  public async getMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ): Promise<MatchedTransactionsPOJO> {
    throw new Error(
      'The `getMatchedTransactions` method is not defined for the transaction type.'
    );
  }

  /**
   * Retrieves the matched transaction details.
   * @param {number} tenantId -
   * @param {number} transactionId -
   * @returns {Promise<MatchedTransactionPOJO>}
   */
  public async getMatchedTransaction(
    tenantId: number,
    transactionId: number
  ): Promise<MatchedTransactionPOJO> {
    throw new Error(
      'The `getMatchedTransaction` method is not defined for the transaction type.'
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
    tenantId: number,
    uncategorizedTransactionIds: Array<number>,
    matchTransactionDTO: IMatchTransactionDTO,
    trx?: Knex.Transaction
  ) {
    const { MatchedBankTransaction } = this.tenancy.models(tenantId);

    await PromisePool.withConcurrency(2)
      .for(uncategorizedTransactionIds)
      .process(async (uncategorizedTransactionId) => {
        await MatchedBankTransaction.query(trx).insert({
          uncategorizedTransactionId,
          referenceType: matchTransactionDTO.referenceType,
          referenceId: matchTransactionDTO.referenceId,
        });
      });
  }
}
