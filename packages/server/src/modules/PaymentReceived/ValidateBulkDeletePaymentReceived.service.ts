import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeletePaymentReceivedService } from './commands/DeletePaymentReceived.service';

@Injectable()
export class ValidateBulkDeletePaymentReceivedService {
  constructor(
    private readonly deletePaymentReceivedService: DeletePaymentReceivedService,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) { }

  public async validateBulkDeletePaymentReceived(
    paymentReceiveIds: number[],
  ): Promise<{
    deletableCount: number;
    nonDeletableCount: number;
    deletableIds: number[];
    nonDeletableIds: number[];
  }> {
    const trx = await this.tenantKnex().transaction({
      isolationLevel: 'read uncommitted',
    });

    try {
      const deletableIds: number[] = [];
      const nonDeletableIds: number[] = [];

      for (const paymentReceiveId of paymentReceiveIds) {
        try {
          await this.deletePaymentReceivedService.deletePaymentReceive(
            paymentReceiveId,
            trx,
          );
          deletableIds.push(paymentReceiveId);
        } catch (error) {
          nonDeletableIds.push(paymentReceiveId);
        }
      }

      await trx.rollback();

      return {
        deletableCount: deletableIds.length,
        nonDeletableCount: nonDeletableIds.length,
        deletableIds,
        nonDeletableIds,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

