import { Service, Inject } from 'typedi';
import { IWarehousesActivatedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { EstimatesActivateWarehouses } from '../../Activate/EstimateWarehousesActivate';

@Service()
export class EstimatesActivateWarehousesSubscriber {
  @Inject()
  private estimatesActivateWarehouses: EstimatesActivateWarehouses;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.warehouse.onActivated,
      this.updateEstimatesWithWarehouseOnActivated
    );
    return bus;
  }

  /**
   * Updates all inventory transactions with the primary warehouse once
   * multi-warehouses feature is activated.
   * @param {IWarehousesActivatedPayload}
   */
  private updateEstimatesWithWarehouseOnActivated = async ({
    tenantId,
    primaryWarehouse,
  }: IWarehousesActivatedPayload) => {
    await this.estimatesActivateWarehouses.updateEstimatesWithWarehouse(
      tenantId,
      primaryWarehouse
    );
  };
}
