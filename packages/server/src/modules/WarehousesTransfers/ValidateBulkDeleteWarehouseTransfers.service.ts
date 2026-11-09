import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeleteWarehouseTransfer } from './commands/DeleteWarehouseTransfer';

@Injectable()
export class ValidateBulkDeleteWarehouseTransfersService {
  constructor(
    private readonly deleteWarehouseTransferService: DeleteWarehouseTransfer,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) {}

  public async validateBulkDeleteWarehouseTransfers(
    warehouseTransferIds: number[],
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

      for (const warehouseTransferId of warehouseTransferIds) {
        try {
          await this.deleteWarehouseTransferService.deleteWarehouseTransfer(
            warehouseTransferId,
            trx,
          );
          deletableIds.push(warehouseTransferId);
        } catch (_error) {
          nonDeletableIds.push(warehouseTransferId);
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
