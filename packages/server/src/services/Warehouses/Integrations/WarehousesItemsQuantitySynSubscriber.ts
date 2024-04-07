import { IInventoryTransactionsCreatedPayload, IInventoryTransactionsDeletedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { WarehousesSettings } from '../WarehousesSettings';
import { WarehousesItemsQuantitySync } from './WarehousesItemsQuantitySync';

@Service()
export class WarehousesItemsQuantitySyncSubscriber {
  @Inject()
  private warehousesItemsQuantitySync: WarehousesItemsQuantitySync;

  @Inject()
  private warehousesSettings: WarehousesSettings;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.inventory.onInventoryTransactionsCreated,
      this.syncWarehousesItemsQuantityOnInventoryTransCreated,
    );
    bus.subscribe(
      events.inventory.onInventoryTransactionsDeleted,
      this.syncWarehousesItemsQuantityOnInventoryTransDeleted,
    );
    return bus;
  }

  /**
   * Syncs warehouses items quantity once inventory transactions created.
   * @param {IInventoryTransactionsCreatedPayload}
   */
  private syncWarehousesItemsQuantityOnInventoryTransCreated = async ({
    tenantId,
    inventoryTransactions,
    trx,
  }: IInventoryTransactionsCreatedPayload) => {
    const isActive = this.warehousesSettings.isMultiWarehousesActive(tenantId);

    // Can't continue if the warehouses features is not active.
    if (!isActive) return;

    await this.warehousesItemsQuantitySync.mutateWarehousesItemsQuantityFromTransactions(
      tenantId,
      inventoryTransactions,
      trx,
    );
  };

  /**
   * Syncs warehouses items quantity once inventory transactions deleted.
   * @param {IInventoryTransactionsDeletedPayload}
   */
  private syncWarehousesItemsQuantityOnInventoryTransDeleted = async ({
    tenantId,
    oldInventoryTransactions,
    trx,
  }: IInventoryTransactionsDeletedPayload) => {
    const isActive = this.warehousesSettings.isMultiWarehousesActive(tenantId);

    // Can't continue if the warehouses feature is not active yet.
    if (!isActive) return;

    await this.warehousesItemsQuantitySync.reverseWarehousesItemsQuantityFromTransactions(
      tenantId,
      oldInventoryTransactions,
      trx,
    );
  };
}
