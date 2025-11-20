import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeleteSaleEstimate } from './commands/DeleteSaleEstimate.service';

@Injectable()
export class ValidateBulkDeleteSaleEstimatesService {
  constructor(
    private readonly deleteSaleEstimateService: DeleteSaleEstimate,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) { }

  public async validateBulkDeleteSaleEstimates(
    saleEstimateIds: number[],
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

      for (const saleEstimateId of saleEstimateIds) {
        try {
          await this.deleteSaleEstimateService.deleteEstimate(
            saleEstimateId,
            trx,
          );
          deletableIds.push(saleEstimateId);
        } catch (error) {
          nonDeletableIds.push(saleEstimateId);
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
