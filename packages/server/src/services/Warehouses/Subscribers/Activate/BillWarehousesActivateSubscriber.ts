import { Service, Inject } from 'typedi';
import { IWarehousesActivatedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { BillActivateWarehouses } from '../../Activate/BillWarehousesActivate';

@Service()
export class BillsActivateWarehousesSubscriber {
  @Inject()
  private billsActivateWarehouses: BillActivateWarehouses;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.warehouse.onActivated,
      this.updateBillsWithWarehouseOnActivated
    );
    return bus;
  }

  /**
   * Updates all inventory transactions with the primary warehouse once
   * multi-warehouses feature is activated.
   * @param {IWarehousesActivatedPayload}
   */
  private updateBillsWithWarehouseOnActivated = async ({
    tenantId,
    primaryWarehouse,
  }: IWarehousesActivatedPayload) => {
    await this.billsActivateWarehouses.updateBillsWithWarehouse(
      tenantId,
      primaryWarehouse
    );
  };
}
