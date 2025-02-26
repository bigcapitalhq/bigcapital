import { Injectable } from '@nestjs/common';
import { InvoicesActivateWarehouses } from '../../Activate/InvoiceWarehousesActivate';
import { OnEvent } from '@nestjs/event-emitter';
import { IWarehousesActivatedPayload } from '../../Warehouse.types';
import { events } from '@/common/events/events';

@Injectable()
export class InvoicesActivateWarehousesSubscriber {
  constructor(
    private readonly invoicesActivateWarehouses: InvoicesActivateWarehouses,
  ) {}

  /**
   * Updates all inventory transactions with the primary warehouse once
   * multi-warehouses feature is activated.
   * @param {IWarehousesActivatedPayload}
   */
  @OnEvent(events.warehouse.onActivated)
  async updateInvoicesWithWarehouseOnActivated({
    primaryWarehouse,
  }: IWarehousesActivatedPayload) {
    await this.invoicesActivateWarehouses.updateInvoicesWithWarehouse(
      primaryWarehouse,
    );
  }
}
