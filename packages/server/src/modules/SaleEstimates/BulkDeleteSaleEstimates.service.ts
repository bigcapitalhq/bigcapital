import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteSaleEstimate } from './commands/DeleteSaleEstimate.service';

@Injectable()
export class BulkDeleteSaleEstimatesService {
  constructor(private readonly deleteSaleEstimateService: DeleteSaleEstimate) { }

  async bulkDeleteSaleEstimates(
    saleEstimateIds: number | Array<number>,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const estimatesIds = uniq(castArray(saleEstimateIds));

    const results = await PromisePool.withConcurrency(1)
      .for(estimatesIds)
      .process(async (saleEstimateId: number) => {
        await this.deleteSaleEstimateService.deleteEstimate(saleEstimateId);
      });

    if (results.errors && results.errors.length > 0) {
      throw results.errors[0].raw;
    }
  }
}

