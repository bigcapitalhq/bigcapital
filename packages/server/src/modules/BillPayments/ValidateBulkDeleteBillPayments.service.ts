import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeleteBillPayment } from './commands/DeleteBillPayment.service';

@Injectable()
export class ValidateBulkDeleteBillPaymentsService {
  constructor(
    private readonly deleteBillPaymentService: DeleteBillPayment,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) {}

  public async validateBulkDeleteBillPayments(
    billPaymentIds: number[],
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

      for (const billPaymentId of billPaymentIds) {
        try {
          await this.deleteBillPaymentService.deleteBillPayment(
            billPaymentId,
            trx,
          );
          deletableIds.push(billPaymentId);
        } catch (error) {
          nonDeletableIds.push(billPaymentId);
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
