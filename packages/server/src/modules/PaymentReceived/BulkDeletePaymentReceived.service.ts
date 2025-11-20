import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeletePaymentReceivedService } from './commands/DeletePaymentReceived.service';

@Injectable()
export class BulkDeletePaymentReceivedService {
  constructor(
    private readonly deletePaymentReceivedService: DeletePaymentReceivedService,
  ) { }

  async bulkDeletePaymentReceived(
    paymentReceiveIds: number | Array<number>,
    options?: { skipUndeletable?: boolean },
    trx?: Knex.Transaction,
  ): Promise<void> {
    const { skipUndeletable = false } = options ?? {};
    const paymentsIds = uniq(castArray(paymentReceiveIds));

    const results = await PromisePool.withConcurrency(1)
      .for(paymentsIds)
      .process(async (paymentReceiveId: number) => {
        try {
          await this.deletePaymentReceivedService.deletePaymentReceive(
            paymentReceiveId,
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

