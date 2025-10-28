import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { ReceiptActivateWarehouses } from '../../Activate/ReceiptWarehousesActivate';
import { events } from '@/common/events/events';
import { IWarehousesActivatedPayload } from '../../Warehouse.types';


@Injectable()
export class ReceiptsActivateWarehousesSubscriber {
  constructor(
    private readonly receiptsActivateWarehouses: ReceiptActivateWarehouses, 
  ) {}

  /**
   * Updates all receipts transactions with the primary warehouse once
   * multi-warehouses feature is activated.
   * @param {IWarehousesActivatedPayload}
   */
  @OnEvent(events.warehouse.onActivated)
  async updateInventoryTransactionsWithWarehouseOnActivated({
    primaryWarehouse,
  }: IWarehousesActivatedPayload) {
    await this.receiptsActivateWarehouses.updateReceiptsWithWarehouse(
      primaryWarehouse
    );
  };
}
