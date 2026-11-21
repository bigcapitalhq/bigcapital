import type { IWarehousesActivatedPayload } from '@/modules/Warehouses/Warehouse.types';
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

  @OnEvent(events.warehouse.onActivated, { suppressErrors: false })
  public async initializeWarehouseBalances({
    primaryWarehouse,
    trx,
  }: IWarehousesActivatedPayload) {
    await trx('batches')
      .whereNull('openingWarehouseId')
      .whereNull('sourceTransactionType')
      .update({ openingWarehouseId: primaryWarehouse.id });
    await trx.raw(
      `
      INSERT INTO BATCH_WAREHOUSE_BALANCES (BATCH_ID, WAREHOUSE_ID, QUANTITY_ON_HAND)
      SELECT ID, ?, QUANTITY_ON_HAND FROM BATCHES WHERE QUANTITY_ON_HAND <> 0
      ON DUPLICATE KEY UPDATE QUANTITY_ON_HAND = VALUES(QUANTITY_ON_HAND)
    `,
      [primaryWarehouse.id],
    );
  }

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
