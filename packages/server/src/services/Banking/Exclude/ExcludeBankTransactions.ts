import { Inject, Service } from 'typedi';
import PromisePool from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { ExcludeBankTransaction } from './ExcludeBankTransaction';

@Service()
export class ExcludeBankTransactions {
  @Inject()
  private excludeBankTransaction: ExcludeBankTransaction;

  /**
   * Exclude bank transactions in bulk.
   * @param {number} tenantId
   * @param {number} bankTransactionIds
   * @returns {Promise<void>}
   */
  public async excludeBankTransactions(
    tenantId: number,
    bankTransactionIds: Array<number> | number
  ) {
    const _bankTransactionIds = uniq(castArray(bankTransactionIds));

    await PromisePool.withConcurrency(1)
      .for(_bankTransactionIds)
      .process((bankTransactionId: number) => {
        return this.excludeBankTransaction.excludeBankTransaction(
          tenantId,
          bankTransactionId
        );
      });
  }
}
