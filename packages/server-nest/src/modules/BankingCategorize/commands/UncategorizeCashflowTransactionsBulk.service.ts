import { castArray } from 'lodash';
import { PromisePool } from '@supercharge/promise-pool';
import { Injectable } from '@nestjs/common';
import { UncategorizeCashflowTransactionService } from './UncategorizeCashflowTransaction.service';

@Injectable()
export class UncategorizeCashflowTransactionsBulk {
  constructor(
    private readonly uncategorizeTransactionService: UncategorizeCashflowTransactionService
  ) {}

  /**
   * Uncategorize the given bank transactions in bulk.
   * @param {number} tenantId
   * @param {number} uncategorizedTransactionId
   */
  public async uncategorizeBulk(
    uncategorizedTransactionId: number | Array<number>
  ) {
    const uncategorizedTransactionIds = castArray(uncategorizedTransactionId);

    const result = await PromisePool.withConcurrency(MIGRATION_CONCURRENCY)
      .for(uncategorizedTransactionIds)
      .process(async (_uncategorizedTransactionId: number, index, pool) => {
        await this.uncategorizeTransactionService.uncategorize(
          _uncategorizedTransactionId
        );
      });
  }
}

const MIGRATION_CONCURRENCY = 1;
