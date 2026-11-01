import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteWarehouseTransfer } from './commands/DeleteWarehouseTransfer';

@Injectable()
export class BulkDeleteWarehouseTransfersService {
  constructor(
    private readonly deleteWarehouseTransferService: DeleteWarehouseTransfer,
  ) {}

  async bulkDeleteWarehouseTransfers(
    warehouseTransferIds: number | Array<number>,
    options?: { skipUndeletable?: boolean },
    _trx?: Knex.Transaction,
  ): Promise<void> {
    const { skipUndeletable = false } = options ?? {};
    const transfersIds = uniq(castArray(warehouseTransferIds));

    const results = await PromisePool.withConcurrency(1)
      .for(transfersIds)
      .process(async (warehouseTransferId: number) => {
        try {
          await this.deleteWarehouseTransferService.deleteWarehouseTransfer(
            warehouseTransferId,
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
