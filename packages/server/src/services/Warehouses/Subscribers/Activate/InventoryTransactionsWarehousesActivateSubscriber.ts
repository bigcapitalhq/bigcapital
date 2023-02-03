import { Service, Inject } from 'typedi';
import { IWarehousesActivatedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { InventoryActivateWarehouses } from '../../Activate/InventoryTransactionsWarehousesActivate';

@Service()
export class InventoryActivateWarehousesSubscriber {
  @Inject()
  private inventoryActivateWarehouses: InventoryActivateWarehouses;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.warehouse.onActivated,
      this.updateInventoryTransactionsWithWarehouseOnActivated
    );
    return bus;
  }

  /**
   * Updates all inventory transactions with the primary warehouse once
   * multi-warehouses feature is activated.
   * @param {IWarehousesActivatedPayload}
   */
  private updateInventoryTransactionsWithWarehouseOnActivated = async ({
    tenantId,
    primaryWarehouse,
  }: IWarehousesActivatedPayload) => {
    await this.inventoryActivateWarehouses.updateInventoryTransactionsWithWarehouse(
      tenantId,
      primaryWarehouse
    );
  };
}
