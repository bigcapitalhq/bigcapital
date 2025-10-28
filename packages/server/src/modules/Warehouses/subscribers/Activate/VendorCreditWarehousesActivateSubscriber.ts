import { VendorCreditActivateWarehouses } from '../../Activate/VendorCreditWarehousesActivate';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { IWarehousesActivatedPayload } from '../../Warehouse.types';
import { events } from '@/common/events/events';

@Injectable()
export class VendorCreditsActivateWarehousesSubscriber {
  constructor(
    private readonly creditsActivateWarehouses: VendorCreditActivateWarehouses,
  ) {}

  /**
   * Updates all inventory transactions with the primary warehouse once
   * multi-warehouses feature is activated.
   * @param {IWarehousesActivatedPayload}
   */
  @OnEvent(events.warehouse.onActivated)
  async updateCreditsWithWarehouseOnActivated({
    primaryWarehouse,
  }: IWarehousesActivatedPayload) {
    await this.creditsActivateWarehouses.updateCreditsWithWarehouse(
      primaryWarehouse,
    );
  }
}
