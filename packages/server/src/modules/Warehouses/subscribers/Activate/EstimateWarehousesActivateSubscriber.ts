import { EstimatesActivateWarehouses } from '../../Activate/EstimateWarehousesActivate';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IWarehousesActivatedPayload } from '../../Warehouse.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EstimatesActivateWarehousesSubscriber {
  constructor(
    private readonly estimatesActivateWarehouses: EstimatesActivateWarehouses,
  ) {}

  /**
   * Updates all inventory transactions with the primary warehouse once
   * multi-warehouses feature is activated.
   * @param {IWarehousesActivatedPayload}
   */
  @OnEvent(events.warehouse.onActivated)
  async updateEstimatessWithWarehouseOnActivated({
    primaryWarehouse,
  }: IWarehousesActivatedPayload) {
    await this.estimatesActivateWarehouses.updateEstimatesWithWarehouse(
      primaryWarehouse,
    );
  }
}
