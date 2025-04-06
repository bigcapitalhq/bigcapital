import PromisePool from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { ExcludeBankTransactionService } from './ExcludeBankTransaction.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExcludeBankTransactionsService {
  constructor(
    private readonly excludeBankTransaction: ExcludeBankTransactionService,
  ) {}

  /**
   * Exclude bank transactions in bulk.
   * @param {Array<number> | number} bankTransactionIds - The IDs of the bank transactions to exclude.
   * @returns {Promise<void>}
   */
  public async excludeBankTransactions(
    bankTransactionIds: Array<number> | number,
  ) {
    const _bankTransactionIds = uniq(castArray(bankTransactionIds));

    await PromisePool.withConcurrency(1)
      .for(_bankTransactionIds)
      .process((bankTransactionId: number) => {
        return this.excludeBankTransaction.excludeBankTransaction(
          bankTransactionId,
        );
      });
  }
}
