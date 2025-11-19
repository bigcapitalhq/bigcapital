import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteSaleInvoice } from './commands/DeleteSaleInvoice.service';

@Injectable()
export class BulkDeleteSaleInvoicesService {
  constructor(private readonly deleteSaleInvoiceService: DeleteSaleInvoice) { }

  async bulkDeleteSaleInvoices(
    saleInvoiceIds: number | Array<number>,
    options?: { skipUndeletable?: boolean },
    trx?: Knex.Transaction,
  ): Promise<void> {
    const { skipUndeletable = false } = options ?? {};
    const invoicesIds = uniq(castArray(saleInvoiceIds));

    const results = await PromisePool.withConcurrency(1)
      .for(invoicesIds)
      .process(async (saleInvoiceId: number) => {
        try {
          await this.deleteSaleInvoiceService.deleteSaleInvoice(saleInvoiceId);
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
