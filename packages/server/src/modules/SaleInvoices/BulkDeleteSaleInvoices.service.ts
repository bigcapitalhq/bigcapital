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
    trx?: Knex.Transaction,
  ): Promise<void> {
    const invoicesIds = uniq(castArray(saleInvoiceIds));

    const results = await PromisePool.withConcurrency(1)
      .for(invoicesIds)
      .process(async (saleInvoiceId: number) => {
        await this.deleteSaleInvoiceService.deleteSaleInvoice(saleInvoiceId);
      });

    if (results.errors && results.errors.length > 0) {
      throw results.errors[0].raw;
    }
  }
}

