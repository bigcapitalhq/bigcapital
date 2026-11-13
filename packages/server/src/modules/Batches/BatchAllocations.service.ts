import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { sumBy } from 'lodash';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { ItemEntryBatch } from '@/modules/TransactionItemEntry/models/ItemEntryBatch';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { BATCHES_ERRORS } from './types/Batches.types';

export interface IEntryBatchAllocationDto {
  batchId?: number;
  quantity?: number;
}

export interface IEntryWithBatchAllocations {
  id?: number;
  index?: number;
  quantity?: number;
  batches?: IEntryBatchAllocationDto[];
}

/**
 * Synchronizes the batch allocations of the given bill/invoice entries.
 */
@Injectable()
export class BatchAllocationsService {
  /**
   * @param {TenantModelProxy<typeof ItemEntry>} itemEntryModel
   * @param {TenantModelProxy<typeof ItemEntryBatch>} itemEntryBatchModel
   */
  constructor(
    @Inject(ItemEntry.name)
    private readonly itemEntryModel: TenantModelProxy<typeof ItemEntry>,

    @Inject(ItemEntryBatch.name)
    private readonly itemEntryBatchModel: TenantModelProxy<
      typeof ItemEntryBatch
    >,
  ) {}

  /**
   * Replaces the stored allocations of the given transaction entries with the
   * allocations of the given DTO entries.
   */
  public async syncEntriesAllocations(
    referenceType: string,
    referenceId: number,
    dtoEntries: IEntryWithBatchAllocations[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    const entries = await this.itemEntryModel()
      .query(trx)
      .where({ referenceType, referenceId });

    if (entries.length === 0) {
      return;
    }
    const entriesIds = entries.map((entry) => entry.id);

    // Removes the previous allocations of the transaction entries.
    await this.itemEntryBatchModel()
      .query(trx)
      .whereIn('entryId', entriesIds)
      .delete();

    const dtoEntriesByIndex = new Map(
      dtoEntries.map((entry, position) => [
        Number(entry.index ?? position + 1),
        entry,
      ]),
    );
    const dtoEntriesById = new Map(
      dtoEntries
        .filter((entry) => entry.id !== undefined && entry.id !== null)
        .map((entry) => [Number(entry.id), entry]),
    );
    const allocationsRows = [];
    const thrownDuplicateBatch = (entry: ItemEntry) => {
      throw new ServiceError(
        BATCHES_ERRORS.BATCH_ALLOCATION_DUPLICATE,
        undefined,
        { entryId: entry.id, entryIndex: entry.index },
      );
    };

    entries.forEach((entry) => {
      const dtoEntry =
        dtoEntriesByIndex.get(Number(entry.index)) ??
        dtoEntriesById.get(Number(entry.id));

      if (!dtoEntry?.batches?.length) {
        return;
      }
      const allocationsSum = sumBy(dtoEntry.batches, (allocation) =>
        Number(allocation.quantity ?? 0),
      );

      if (Math.abs(allocationsSum - Number(entry.quantity)) > 0.0001) {
        throw new ServiceError(
          BATCHES_ERRORS.BATCH_ALLOCATION_QUANTITY_MISMATCH,
          undefined,
          {
            entryId: entry.id,
            entryIndex: entry.index,
            entryQuantity: Number(entry.quantity),
            allocatedQuantity: allocationsSum,
          },
        );
      }
      const seenBatches = new Set<number>();

      dtoEntry.batches.forEach((allocation) => {
        const batchId = Number(allocation.batchId);
        const quantity = Number(allocation.quantity ?? 0);

        if (!batchId || !Number.isFinite(quantity) || quantity <= 0) {
          throw new ServiceError(
            BATCHES_ERRORS.BATCH_ALLOCATION_INVALID_QUANTITY,
            undefined,
            { entryId: entry.id, batchId, quantity },
          );
        }
        if (seenBatches.has(batchId)) {
          thrownDuplicateBatch(entry);
        }
        seenBatches.add(batchId);
        allocationsRows.push({
          entryId: entry.id,
          batchId,
          quantity,
        });
      });
    });

    if (allocationsRows.length > 0) {
      await this.itemEntryBatchModel().query(trx).insertGraph(allocationsRows);
    }
  }
}
