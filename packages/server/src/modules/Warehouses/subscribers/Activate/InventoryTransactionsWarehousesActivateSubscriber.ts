import { InventoryActivateWarehouses } from '../../Activate/InventoryTransactionsWarehousesActivate';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { IWarehousesActivatedPayload } from '../../Warehouse.types';

@Injectable()
export class InventoryActivateWarehousesSubscriber {
  constructor(
    private readonly inventoryActivateWarehouses: InventoryActivateWarehouses,
  ) {}

  /**
   * Updates all inventory transactions with the primary warehouse once
   * multi-warehouses feature is activated.
   * @param {IWarehousesActivatedPayload}
   */
  @OnEvent(events.warehouse.onActivated)
  async updateInventoryTransactionsWithWarehouseOnActivated({
    primaryWarehouse,
  }: IWarehousesActivatedPayload) {
    await this.inventoryActivateWarehouses.updateInventoryTransactionsWithWarehouse(
      primaryWarehouse,
    );
  }
}
