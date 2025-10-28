import { Injectable } from '@nestjs/common';
import { CreditNotesActivateWarehouses } from '../../Activate/CreditNoteWarehousesActivate';
import { OnEvent } from '@nestjs/event-emitter';
import { IWarehousesActivatedPayload } from '../../Warehouse.types';
import { events } from '@/common/events/events';

@Injectable()
export class CreditsActivateWarehousesSubscriber {
  constructor(
    private readonly creditsActivateWarehouses: CreditNotesActivateWarehouses,
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
    await this.creditsActivateWarehouses.updateCreditsWithWarehouse(
      primaryWarehouse,
    );
  }
}
