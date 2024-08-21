import PromisePool from '@supercharge/promise-pool';
import { castArray } from 'lodash';
import { Service, Inject } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { UncategorizeCashflowTransaction } from './UncategorizeCashflowTransaction';

@Service()
export class UncategorizeCashflowTransactionsBulk {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uncategorizeTransaction: UncategorizeCashflowTransaction;

  /**
   * Uncategorize the given bank transactions in bulk.
   * @param {number} tenantId
   * @param {number} uncategorizedTransactionId
   */
  public async uncategorizeBulk(
    tenantId: number,
    uncategorizedTransactionId: number | Array<number>
  ) {
    const uncategorizedTransactionIds = castArray(uncategorizedTransactionId);

    const result = await PromisePool.withConcurrency(MIGRATION_CONCURRENCY)
      .for(uncategorizedTransactionIds)
      .process(async (_uncategorizedTransactionId: number, index, pool) => {
        await this.uncategorizeTransaction.uncategorize(
          tenantId,
          _uncategorizedTransactionId
        );
      });
  }
}

const MIGRATION_CONCURRENCY = 1;
