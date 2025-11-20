import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteSaleReceipt } from './commands/DeleteSaleReceipt.service';

@Injectable()
export class BulkDeleteSaleReceiptsService {
  constructor(
    private readonly deleteSaleReceiptService: DeleteSaleReceipt,
  ) { }

  async bulkDeleteSaleReceipts(
    saleReceiptIds: number | number[],
    options?: { skipUndeletable?: boolean },
    trx?: Knex.Transaction,
  ): Promise<void> {
    const { skipUndeletable = false } = options ?? {};
    const receiptIds = uniq(castArray(saleReceiptIds));

    const results = await PromisePool.withConcurrency(1)
      .for(receiptIds)
      .process(async (saleReceiptId: number) => {
        try {
          await this.deleteSaleReceiptService.deleteSaleReceipt(saleReceiptId);
        } catch (error) {
          if (!skipUndeletable) {
            throw error;
          }
        }
      });

    if (!skipUndeletable && results.errors && results.errors.length > 0) {
      throw results.errors[0].raw;
    }
  }
}


