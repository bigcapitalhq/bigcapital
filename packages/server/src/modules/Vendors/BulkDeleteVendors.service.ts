import { Injectable } from '@nestjs/common';
import { castArray, uniq } from 'lodash';
import { PromisePool } from '@supercharge/promise-pool';
import { DeleteVendorService } from './commands/DeleteVendor.service';

@Injectable()
export class BulkDeleteVendorsService {
  constructor(private readonly deleteVendorService: DeleteVendorService) {}

  public async bulkDeleteVendors(
    vendorIds: number[],
    options?: { skipUndeletable?: boolean },
  ): Promise<void> {
    const { skipUndeletable = false } = options ?? {};
    const ids = uniq(castArray(vendorIds));

    const results = await PromisePool.withConcurrency(1)
      .for(ids)
      .process(async (vendorId: number) => {
        try {
          await this.deleteVendorService.deleteVendor(vendorId);
        } catch (error) {
          if (!skipUndeletable) {
            throw error;
          }
        }
      });

    if (!skipUndeletable && results.errors && results.errors.length > 0) {
      throw results.errors[0].raw ?? results.errors[0];
    }
  }
}

