import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteBillPayment } from './commands/DeleteBillPayment.service';

@Injectable()
export class BulkDeleteBillPaymentsService {
  constructor(private readonly deleteBillPaymentService: DeleteBillPayment) {}

  async bulkDeleteBillPayments(
    billPaymentIds: number | Array<number>,
    options?: { skipUndeletable?: boolean },
    trx?: Knex.Transaction,
  ): Promise<void> {
    const { skipUndeletable = false } = options ?? {};
    const paymentsIds = uniq(castArray(billPaymentIds));

    const results = await PromisePool.withConcurrency(1)
      .for(paymentsIds)
      .process(async (billPaymentId: number) => {
        try {
          await this.deleteBillPaymentService.deleteBillPayment(
            billPaymentId,
            trx,
          );
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
