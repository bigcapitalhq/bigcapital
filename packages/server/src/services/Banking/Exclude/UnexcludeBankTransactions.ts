import { Inject, Service } from 'typedi';
import PromisePool from '@supercharge/promise-pool';
import { UnexcludeBankTransaction } from './UnexcludeBankTransaction';
import { castArray } from 'lodash';

@Service()
export class UnexcludeBankTransactions {
  @Inject()
  private unexcludeBankTransaction: UnexcludeBankTransaction;

  /**
   * Unexclude bank transactions in bulk.
   * @param {number} tenantId
   * @param {number} bankTransactionIds
   */
  public async unexcludeBankTransactions(
    tenantId: number,
    bankTransactionIds: Array<number> | number
  ) {
    const _bankTransactionIds = castArray(bankTransactionIds);

    await PromisePool.withConcurrency(1)
      .for(_bankTransactionIds)
      .process((bankTransactionId: number) => {
        return this.unexcludeBankTransaction.unexcludeBankTransaction(
          tenantId,
          bankTransactionId
        );
      });
  }
}
