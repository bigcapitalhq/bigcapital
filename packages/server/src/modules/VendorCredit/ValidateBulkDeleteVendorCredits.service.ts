import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeleteVendorCreditService } from './commands/DeleteVendorCredit.service';

@Injectable()
export class ValidateBulkDeleteVendorCreditsService {
  constructor(
    private readonly deleteVendorCreditService: DeleteVendorCreditService,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) { }

  public async validateBulkDeleteVendorCredits(
    vendorCreditIds: number[],
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

      for (const vendorCreditId of vendorCreditIds) {
        try {
          await this.deleteVendorCreditService.deleteVendorCredit(
            vendorCreditId,
            trx,
          );
          deletableIds.push(vendorCreditId);
        } catch (error) {
          nonDeletableIds.push(vendorCreditId);
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

