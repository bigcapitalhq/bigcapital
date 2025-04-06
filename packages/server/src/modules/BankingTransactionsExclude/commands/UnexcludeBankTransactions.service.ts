import { Injectable } from '@nestjs/common';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { UnexcludeBankTransactionService } from './UnexcludeBankTransaction.service';

@Injectable()
export class UnexcludeBankTransactionsService {
  constructor(
    private readonly unexcludeBankTransaction: UnexcludeBankTransactionService,
  ) {}

  /**
   * Unexclude bank transactions in bulk.
   * @param {Array<number> | number} bankTransactionIds - The IDs of the bank transactions to unexclude.
   */
  public async unexcludeBankTransactions(
    bankTransactionIds: Array<number> | number
  ) {
    const _bankTransactionIds = uniq(castArray(bankTransactionIds));

    await PromisePool.withConcurrency(1)
      .for(_bankTransactionIds)
      .process((bankTransactionId: number) => {
        return this.unexcludeBankTransaction.unexcludeBankTransaction(
          bankTransactionId
        );
      });
  }
}
