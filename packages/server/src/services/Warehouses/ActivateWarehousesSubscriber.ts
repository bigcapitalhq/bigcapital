import { IWarehousesActivatedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { CreateInitialWarehousesItemsQuantity } from './CreateInitialWarehousesitemsQuantity';
import { UpdateInventoryTransactionsWithWarehouse } from './UpdateInventoryTransactionsWithWarehouse';

@Service()
export class ActivateWarehousesSubscriber {
  @Inject()
  private updateInventoryTransactionsWithWarehouse: UpdateInventoryTransactionsWithWarehouse;

  @Inject()
  private createInitialWarehousesItemsQuantity: CreateInitialWarehousesItemsQuantity;

  /**
   * Attaches events with handlers.
   */
  attach(bus) {
    bus.subscribe(events.warehouse.onActivated, this.updateInventoryTransactionsWithWarehouseOnActivating);
    bus.subscribe(events.warehouse.onActivated, this.createInitialWarehousesItemsQuantityOnActivating);
    return bus;
  }

  /**
   * Updates inventory transactiont to primary warehouse once
   * multi-warehouses activated.
   * @param {IWarehousesActivatedPayload}
   */
  private updateInventoryTransactionsWithWarehouseOnActivating = async ({
    tenantId,
    primaryWarehouse,
  }: IWarehousesActivatedPayload) => {
    await this.updateInventoryTransactionsWithWarehouse.run(tenantId, primaryWarehouse.id);
  };

  /**
   * Creates initial warehouses items quantity once the multi-warehouses activated.
   * @param {IWarehousesActivatedPayload}
   */
  private createInitialWarehousesItemsQuantityOnActivating = async ({
    tenantId,
    primaryWarehouse,
  }: IWarehousesActivatedPayload) => {
    await this.createInitialWarehousesItemsQuantity.run(tenantId, primaryWarehouse.id);
  };
}
