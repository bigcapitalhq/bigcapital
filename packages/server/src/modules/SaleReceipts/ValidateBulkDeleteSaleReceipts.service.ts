import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeleteSaleReceipt } from './commands/DeleteSaleReceipt.service';

@Injectable()
export class ValidateBulkDeleteSaleReceiptsService {
  constructor(
    private readonly deleteSaleReceiptService: DeleteSaleReceipt,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) {}

  public async validateBulkDeleteSaleReceipts(
    saleReceiptIds: number[],
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

      for (const saleReceiptId of saleReceiptIds) {
        try {
          await this.deleteSaleReceiptService.deleteSaleReceipt(
            saleReceiptId,
            trx,
          );
          deletableIds.push(saleReceiptId);
        } catch (error) {
          nonDeletableIds.push(saleReceiptId);
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


