import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Batch } from './models/Batch';
import { Item } from '@/modules/Items/models/Item';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { BatchesBalanceService } from './BatchesBalance.service';
import { BATCHES_ERRORS } from './types/Batches.types';

export interface IEntryBatchAllocation {
  batchId?: number | null;
  quantity?: number;
}

export interface IEntryBatchReference {
  itemId: number;
  batchId?: number | null;
  quantity?: number;
  batches?: IEntryBatchAllocation[];
}

interface IValidateBatchesEntriesOptions {
  checkAvailability?: boolean;
  referenceType?: string;
  referenceId?: number;
}

@Injectable()
export class BatchesValidators {
  /**
   * @param {TenantModelProxy<typeof Batch>} batchModel
   * @param {TenantModelProxy<typeof Item>} itemModel
   * @param {BatchesBalanceService} batchesBalance
   */
  constructor(
    @Inject(Batch.name)
    private readonly batchModel: TenantModelProxy<typeof Batch>,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    private readonly batchesBalance: BatchesBalanceService,
  ) {}

  /**
   * Validates the batch existence.
   */
  public validateBatchExistance(batch: Batch | undefined): void {
    if (!batch) {
      throw new ServiceError(BATCHES_ERRORS.BATCH_NOT_FOUND);
    }
  }

  /**
   * Validates the inventory item existence of the batch.
   */
  public async validateBatchItem(itemId: number): Promise<Item> {
    const item = await this.itemModel().query().findById(itemId);

    if (!item) {
      throw new ServiceError(BATCHES_ERRORS.BATCH_ITEM_NOT_FOUND);
    }
    if (item.type !== 'inventory') {
      throw new ServiceError(BATCHES_ERRORS.BATCH_ITEM_NOT_INVENTORY);
    }
    return item;
  }

  /**
   * Validates the batch number uniqueness within the given item.
   */
  public async validateBatchNumberUnique(
    itemId: number,
    batchNumber: string,
    excludeBatchId?: number,
  ): Promise<void> {
    const query = this.batchModel()
      .query()
      .findOne({ itemId, batchNumber: batchNumber.trim() });

    if (excludeBatchId) {
      query.whereNot('id', excludeBatchId);
    }
    const existingBatch = await query;

    if (existingBatch) {
      throw new ServiceError(BATCHES_ERRORS.BATCH_NUMBER_EXISTS);
    }
  }

  /**
   * Validates the manufactured and expiry dates.
   */
  public validateBatchDates(
    manufacturedDate?: Date | string | null,
    expiryDate?: Date | string | null,
  ): void {
    if (
      manufacturedDate &&
      expiryDate &&
      moment(expiryDate).isBefore(moment(manufacturedDate), 'day')
    ) {
      throw new ServiceError(BATCHES_ERRORS.BATCH_INVALID_EXPIRY_DATE);
    }
  }

  /**
   * Validates the given line item entries batches: existence, item ownership
   * and (optionally) the available quantity of each batch.
   */
  public async validateEntriesBatches(
    entries: IEntryBatchReference[],
    options: IValidateBatchesEntriesOptions = {},
  ): Promise<void> {
    const normalizedEntries = entries.map((entry) => {
      const allocations = entry.batches?.length
        ? entry.batches
        : entry.batchId !== null && entry.batchId !== undefined
          ? [{ batchId: entry.batchId, quantity: entry.quantity }]
          : [];

      if (entry.batches?.length && entry.quantity !== undefined) {
        const allocatedQuantity = allocations.reduce(
          (sum, allocation) => sum + Number(allocation.quantity ?? 0),
          0,
        );
        if (Math.abs(allocatedQuantity - Number(entry.quantity)) > 0.0001) {
          throw new ServiceError(
            BATCHES_ERRORS.BATCH_ALLOCATION_QUANTITY_MISMATCH,
            undefined,
            {
              entryQuantity: Number(entry.quantity),
              allocatedQuantity,
              itemId: entry.itemId,
            },
          );
        }
      }
      return { entry, allocations };
    });

    const batchesReferences = normalizedEntries.flatMap(
      ({ entry, allocations }) =>
        allocations.map((allocation) => ({
          itemId: entry.itemId,
          batchId: allocation.batchId,
          quantity: allocation.quantity,
        })),
    );
    const batchesEntries = batchesReferences.filter(
      (entry) => entry.batchId !== null && entry.batchId !== undefined,
    );

    if (batchesEntries.length === 0) {
      return;
    }
    const batchesIds = [
      ...new Set(batchesEntries.map((entry) => Number(entry.batchId))),
    ];
    const batches = await this.batchModel().query().whereIn('id', batchesIds);

    if (batches.length !== batchesIds.length) {
      throw new ServiceError(BATCHES_ERRORS.BATCH_NOT_FOUND);
    }
    const batchesMap = new Map(batches.map((batch) => [batch.id, batch]));

    batchesEntries.forEach((entry) => {
      const batch = batchesMap.get(Number(entry.batchId));

      if (!batch) {
        throw new ServiceError(BATCHES_ERRORS.BATCH_NOT_FOUND);
      }
      if (Number(batch.itemId) !== Number(entry.itemId)) {
        throw new ServiceError(BATCHES_ERRORS.BATCH_ITEM_MISMATCH);
      }
    });

    if (!options.checkAvailability) {
      return;
    }
    const requestedQuantities = batchesEntries.reduce((map, entry) => {
      const batchId = Number(entry.batchId);
      map.set(batchId, (map.get(batchId) ?? 0) + Number(entry.quantity ?? 0));
      return map;
    }, new Map<number, number>());

    const excludeTransaction =
      options.referenceType && options.referenceId
        ? {
            transactionType: options.referenceType,
            transactionId: options.referenceId,
          }
        : undefined;

    for (const [batchId, requestedQuantity] of requestedQuantities.entries()) {
      const batch = batchesMap.get(batchId)!;
      const availableQuantity = await this.batchesBalance.getAvailableQuantity(
        batch,
        excludeTransaction,
      );

      if (requestedQuantity - availableQuantity > 0.0001) {
        throw new ServiceError(
          BATCHES_ERRORS.BATCH_INSUFFICIENT_QUANTITY,
          undefined,
          {
            batchId,
            batchNumber: batch.batchNumber,
            requestedQuantity,
            availableQuantity,
          },
        );
      }
    }
  }
}
