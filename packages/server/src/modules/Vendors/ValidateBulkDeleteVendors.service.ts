import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeleteVendorService } from './commands/DeleteVendor.service';
import { ModelHasRelationsError } from '@/common/exceptions/ModelHasRelations.exception';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class ValidateBulkDeleteVendorsService {
  constructor(
    private readonly deleteVendorService: DeleteVendorService,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) {}

  public async validateBulkDeleteVendors(vendorIds: number[]): Promise<{
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

      for (const vendorId of vendorIds) {
        try {
          await this.deleteVendorService.deleteVendor(vendorId, trx);
          deletableIds.push(vendorId);
        } catch (error) {
          if (
            error instanceof ModelHasRelationsError ||
            (error instanceof ServiceError &&
              error.errorType === 'VENDOR_HAS_TRANSACTIONS')
          ) {
            nonDeletableIds.push(vendorId);
          } else {
            nonDeletableIds.push(vendorId);
          }
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

