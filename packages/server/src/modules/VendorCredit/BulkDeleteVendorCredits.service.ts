import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteVendorCreditService } from './commands/DeleteVendorCredit.service';

@Injectable()
export class BulkDeleteVendorCreditsService {
  constructor(
    private readonly deleteVendorCreditService: DeleteVendorCreditService,
  ) { }

  async bulkDeleteVendorCredits(
    vendorCreditIds: number | Array<number>,
    options?: { skipUndeletable?: boolean },
    trx?: Knex.Transaction,
  ): Promise<void> {
    const { skipUndeletable = false } = options ?? {};
    const creditsIds = uniq(castArray(vendorCreditIds));

    const results = await PromisePool.withConcurrency(1)
      .for(creditsIds)
      .process(async (vendorCreditId: number) => {
        try {
          await this.deleteVendorCreditService.deleteVendorCredit(
            vendorCreditId,
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

