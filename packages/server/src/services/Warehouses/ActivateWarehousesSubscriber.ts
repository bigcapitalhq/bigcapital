import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { IWarehousesActivatedPayload } from '@/interfaces';
import { UpdateInventoryTransactionsWithWarehouse } from './UpdateInventoryTransactionsWithWarehouse';
import { CreateInitialWarehousesItemsQuantity } from './CreateInitialWarehousesItemsQuantity';

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
    bus.subscribe(
      events.warehouse.onActivated,
      this.updateInventoryTransactionsWithWarehouseOnActivating
    );
    bus.subscribe(
      events.warehouse.onActivated,
      this.createInitialWarehousesItemsQuantityOnActivating
    );
    return bus;
  }

  /**
   * Updates inventory transaction to primary warehouse once
   * multi-warehouses activated.
   * @param {IWarehousesActivatedPayload}
   */
  private updateInventoryTransactionsWithWarehouseOnActivating = async ({
    tenantId,
    primaryWarehouse,
  }: IWarehousesActivatedPayload) => {
    await this.updateInventoryTransactionsWithWarehouse.run(
      tenantId,
      primaryWarehouse.id
    );
  };

  /**
   * Creates initial warehouses items quantity once the multi-warehouses activated.
   * @param {IWarehousesActivatedPayload}
   */
  private createInitialWarehousesItemsQuantityOnActivating = async ({
    tenantId,
    primaryWarehouse,
  }: IWarehousesActivatedPayload) => {
    await this.createInitialWarehousesItemsQuantity.run(
      tenantId,
      primaryWarehouse.id
    );
  };
}
