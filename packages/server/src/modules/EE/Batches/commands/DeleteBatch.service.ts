import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { WarehouseTransferEntry } from '@/modules/WarehousesTransfers/models/WarehouseTransferEntry';
import { InventoryAdjustmentEntry } from '@/modules/InventoryAdjutments/models/InventoryAdjustmentEntry';
import { Batch } from '../models/Batch';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { ItemEntryBatch } from '@/modules/TransactionItemEntry/models/ItemEntryBatch';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { batchEvents } from '../Batches.events';
import { BatchesValidators } from '../BatchesValidators.service';
import {
  BATCHES_ERRORS,
  IBatchDeletedPayload,
  IBatchDeletingPayload,
} from '../types/Batches.types';

@Injectable()
export class DeleteBatchService {
  /**
   * @param {EventEmitter2} eventEmitter
   * @param {UnitOfWork} uow
   * @param {TenantModelProxy<typeof Batch>} batchModel
   * @param {TenantModelProxy<typeof ItemEntry>} itemEntryModel
   * @param {TenantModelProxy<typeof InventoryTransaction>} inventoryTransactionModel
   * @param {BatchesValidators} validators
   */
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(Batch.name)
    private readonly batchModel: TenantModelProxy<typeof Batch>,

    @Inject(ItemEntry.name)
    private readonly itemEntryModel: TenantModelProxy<typeof ItemEntry>,

    @Inject(ItemEntryBatch.name)
    private readonly itemEntryBatchModel: TenantModelProxy<
      typeof ItemEntryBatch
    >,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,

    @Inject(WarehouseTransferEntry.name)
    private readonly transferEntryModel: TenantModelProxy<
      typeof WarehouseTransferEntry
    >,

    @Inject(InventoryAdjustmentEntry.name)
    private readonly adjustmentEntryModel: TenantModelProxy<
      typeof InventoryAdjustmentEntry
    >,

    private readonly validators: BatchesValidators,
  ) {}

  /**
   * Deletes the given batch when it has no associated transactions.
   */
  public async deleteBatch(id: number): Promise<void> {
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const oldBatch = await this.batchModel()
        .query(trx)
        .findById(id)
        .forUpdate();
      this.validators.validateBatchExistance(oldBatch);

      const references = await Promise.all([
        this.inventoryTransactionModel().query(trx).findOne({ batchId: id }),
        this.itemEntryModel().query(trx).findOne({ batchId: id }),
        this.itemEntryBatchModel().query(trx).findOne({ batchId: id }),
        this.transferEntryModel().query(trx).findOne({ batchId: id }),
        this.adjustmentEntryModel().query(trx).findOne({ batchId: id }),
      ]);
      if (references.some(Boolean)) {
        throw new ServiceError(
          BATCHES_ERRORS.BATCH_HAS_ASSOCIATED_TRANSACTIONS,
        );
      }

      // Triggers `onBatchDeleting` event.
      await this.eventEmitter.emitAsync(batchEvents.onDeleting, {
        batchId: id,
        oldBatch,
        trx,
      } as IBatchDeletingPayload);

      await this.batchModel().query(trx).deleteById(id);

      // Triggers `onBatchDeleted` event.
      await this.eventEmitter.emitAsync(batchEvents.onDeleted, {
        batchId: id,
        oldBatch,
        trx,
      } as IBatchDeletedPayload);
    });
  }
}
