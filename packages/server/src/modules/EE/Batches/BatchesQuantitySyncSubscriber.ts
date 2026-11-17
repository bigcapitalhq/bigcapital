import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import {
  IInventoryTransactionsCreatedPayload,
  IInventoryTransactionsDeletedPayload,
} from '@/modules/InventoryCost/types/InventoryCost.types';
import { BatchesQuantitySyncService } from './BatchesQuantitySync.service';

@Injectable()
export class BatchesQuantitySyncSubscriber {
  constructor(
    private readonly batchesQuantitySync: BatchesQuantitySyncService,
  ) {}

  /**
   * Syncs the batches quantity on hand once inventory transactions created.
   * @param {IInventoryTransactionsCreatedPayload} payload
   */
  @OnEvent(events.inventory.onInventoryTransactionsCreated, {
    suppressErrors: false,
  })
  public async syncBatchesQuantityOnInventoryTransactionsCreated({
    inventoryTransactions,
    trx,
  }: IInventoryTransactionsCreatedPayload) {
    await this.batchesQuantitySync.mutateBatchesQuantityFromTransactions(
      inventoryTransactions,
      trx,
    );
  }

  /**
   * Syncs the batches quantity on hand once inventory transactions deleted.
   * @param {IInventoryTransactionsDeletedPayload} payload
   */
  @OnEvent(events.inventory.onInventoryTransactionsDeleted, {
    suppressErrors: false,
  })
  public async syncBatchesQuantityOnInventoryTransactionsDeleted({
    oldInventoryTransactions,
    trx,
  }: IInventoryTransactionsDeletedPayload) {
    await this.batchesQuantitySync.reverseBatchesQuantityFromTransactions(
      oldInventoryTransactions,
      trx,
    );
  }
}
