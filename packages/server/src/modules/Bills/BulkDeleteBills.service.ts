import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteBill } from './commands/DeleteBill.service';

@Injectable()
export class BulkDeleteBillsService {
  constructor(private readonly deleteBillService: DeleteBill) { }

  async bulkDeleteBills(
    billIds: number | Array<number>,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const billsIds = uniq(castArray(billIds));

    const results = await PromisePool.withConcurrency(1)
      .for(billsIds)
      .process(async (billId: number) => {
        await this.deleteBillService.deleteBill(billId);
      });

    if (results.errors && results.errors.length > 0) {
      throw results.errors[0].raw;
    }
  }
}

