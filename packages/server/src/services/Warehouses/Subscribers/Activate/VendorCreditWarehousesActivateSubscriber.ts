import { Service, Inject } from 'typedi';
import { IWarehousesActivatedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { VendorCreditActivateWarehouses } from '../../Activate/VendorCreditWarehousesActivate';

@Service()
export class VendorCreditsActivateWarehousesSubscriber {
  @Inject()
  private creditsActivateWarehouses: VendorCreditActivateWarehouses;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.warehouse.onActivated,
      this.updateCreditsWithWarehouseOnActivated
    );
    return bus;
  }

  /**
   * Updates all inventory transactions with the primary warehouse once
   * multi-warehouses feature is activated.
   * @param {IWarehousesActivatedPayload}
   */
  private updateCreditsWithWarehouseOnActivated = async ({
    tenantId,
    primaryWarehouse,
  }: IWarehousesActivatedPayload) => {
    await this.creditsActivateWarehouses.updateCreditsWithWarehouse(
      tenantId,
      primaryWarehouse
    );
  };
}
