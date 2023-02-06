import { Service, Inject } from 'typedi';
import { IWarehousesActivatedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { ReceiptActivateWarehouses } from '../../Activate/ReceiptWarehousesActivate';

@Service()
export class ReceiptsActivateWarehousesSubscriber {
  @Inject()
  private receiptsActivateWarehouses: ReceiptActivateWarehouses;

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
   * Updates all receipts transactions with the primary warehouse once
   * multi-warehouses feature is activated.
   * @param {IWarehousesActivatedPayload}
   */
  private updateInventoryTransactionsWithWarehouseOnActivated = async ({
    tenantId,
    primaryWarehouse,
  }: IWarehousesActivatedPayload) => {
    await this.receiptsActivateWarehouses.updateReceiptsWithWarehouse(
      tenantId,
      primaryWarehouse
    );
  };
}
