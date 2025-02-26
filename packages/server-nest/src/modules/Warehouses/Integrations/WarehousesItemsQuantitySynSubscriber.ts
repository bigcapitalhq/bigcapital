import { WarehousesItemsQuantitySync } from './WarehousesItemsQuantitySync';
import { WarehousesSettings } from '../WarehousesSettings';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import {
  IInventoryTransactionsCreatedPayload,
  IInventoryTransactionsDeletedPayload,
} from '@/modules/InventoryCost/types/InventoryCost.types';

@Injectable()
export class WarehousesItemsQuantitySyncSubscriber {
  constructor(
    private readonly warehousesItemsQuantitySync: WarehousesItemsQuantitySync,
    private readonly warehousesSettings: WarehousesSettings,
  ) {}

  /**
   * Syncs warehouses items quantity once inventory transactions created.
   * @param {IInventoryTransactionsCreatedPayload}
   */
  @OnEvent(events.inventory.onInventoryTransactionsCreated)
  async syncWarehousesItemsQuantityOnInventoryTransCreated({
    inventoryTransactions,
    trx,
  }: IInventoryTransactionsCreatedPayload) {
    const isActive = this.warehousesSettings.isMultiWarehousesActive();

    // Can't continue if the warehouses features is not active.
    if (!isActive) return;

    await this.warehousesItemsQuantitySync.mutateWarehousesItemsQuantityFromTransactions(
      inventoryTransactions,
      trx,
    );
  }

  /**
   * Syncs warehouses items quantity once inventory transactions deleted.
   * @param {IInventoryTransactionsDeletedPayload}
   */
  @OnEvent(events.inventory.onInventoryTransactionsDeleted)
  async syncWarehousesItemsQuantityOnInventoryTransDeleted({
    oldInventoryTransactions,
    trx,
  }: IInventoryTransactionsDeletedPayload) {
    const isActive = this.warehousesSettings.isMultiWarehousesActive();

    // Can't continue if the warehouses feature is not active yet.
    if (!isActive) return;

    await this.warehousesItemsQuantitySync.reverseWarehousesItemsQuantityFromTransactions(
      oldInventoryTransactions,
      trx,
    );
  }
}
