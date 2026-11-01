import { castArray } from 'lodash';
import { PromisePool } from '@supercharge/promise-pool';
import { Injectable } from '@nestjs/common';
import { UncategorizeBankTransactionService } from './UncategorizeBankTransaction.service';

@Injectable()
export class UncategorizeBankTransactionsBulk {
  constructor(
    private readonly uncategorizeTransactionService: UncategorizeBankTransactionService,
  ) {}

  /**
   * Uncategorize the given bank transactions in bulk.
   * @param {number | Array<number>} uncategorizedTransactionId
   */
  public async uncategorizeBulk(
    uncategorizedTransactionId: number | Array<number>,
  ) {
    const uncategorizedTransactionIds = castArray(uncategorizedTransactionId);

    const _result = await PromisePool.withConcurrency(MIGRATION_CONCURRENCY)
      .for(uncategorizedTransactionIds)
      .process(async (_uncategorizedTransactionId: number, _index, _pool) => {
        await this.uncategorizeTransactionService.uncategorize(
          _uncategorizedTransactionId,
        );
      });
  }
}

const MIGRATION_CONCURRENCY = 1;
