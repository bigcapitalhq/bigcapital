import { Inject, Service } from 'typedi';
import { ExcludeBankTransaction } from './ExcludeBankTransaction';
import PromisePool from '@supercharge/promise-pool';
import { castArray } from 'lodash';

@Service()
export class ExcludeBankTransactions {
  @Inject()
  private excludeBankTransaction: ExcludeBankTransaction;

  /**
   * Exclude bank transactions in bulk.
   * @param {number} tenantId
   * @param {number} bankTransactionIds
   */
  public async excludeBankTransactions(
    tenantId: number,
    bankTransactionIds: Array<number> | number
  ) {
    const _bankTransactionIds = castArray(bankTransactionIds);

    await PromisePool.withConcurrency(1)
      .for(_bankTransactionIds)
      .process(async (bankTransactionId: number) => {
        return this.excludeBankTransaction.excludeBankTransaction(
          tenantId,
          bankTransactionId
        );
      });
  }
}
