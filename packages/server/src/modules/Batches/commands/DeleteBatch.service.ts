import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { Batch } from '../models/Batch';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { ItemEntryBatch } from '@/modules/TransactionItemEntry/models/ItemEntryBatch';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
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

    private readonly validators: BatchesValidators,
  ) {}

  /**
   * Deletes the given batch when it has no associated transactions.
   */
  public async deleteBatch(id: number): Promise<void> {
    const oldBatch = await this.batchModel().query().findById(id);
    this.validators.validateBatchExistance(oldBatch);

    const transactionsCount = await this.inventoryTransactionModel()
      .query()
      .where('batchId', id)
      .resultSize();

    const entriesCount = await this.itemEntryModel()
      .query()
      .where('batchId', id)
      .resultSize();

    const allocationsCount = await this.itemEntryBatchModel()
      .query()
      .where('batchId', id)
      .resultSize();

    if (transactionsCount > 0 || entriesCount > 0 || allocationsCount > 0) {
      throw new ServiceError(BATCHES_ERRORS.BATCH_HAS_ASSOCIATED_TRANSACTIONS);
    }

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBatchDeleting` event.
      await this.eventEmitter.emitAsync(events.batch.onDeleting, {
        batchId: id,
        oldBatch,
        trx,
      } as IBatchDeletingPayload);

      await this.batchModel().query(trx).deleteById(id);

      // Triggers `onBatchDeleted` event.
      await this.eventEmitter.emitAsync(events.batch.onDeleted, {
        batchId: id,
        oldBatch,
        trx,
      } as IBatchDeletedPayload);
    });
  }
}
