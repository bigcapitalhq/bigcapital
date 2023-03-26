import { Service, Inject } from 'typedi';
import { IWarehousesActivatedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { CreditNotesActivateWarehouses } from '../../Activate/CreditNoteWarehousesActivate';

@Service()
export class CreditsActivateWarehousesSubscriber {
  @Inject()
  private creditsActivateWarehouses: CreditNotesActivateWarehouses;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.warehouse.onActivated,
      this.updateInvoicesWithWarehouseOnActivated
    );
    return bus;
  }

  /**
   * Updates all inventory transactions with the primary warehouse once
   * multi-warehouses feature is activated.
   * @param {IWarehousesActivatedPayload}
   */
  private updateInvoicesWithWarehouseOnActivated = async ({
    tenantId,
    primaryWarehouse,
  }: IWarehousesActivatedPayload) => {
    await this.creditsActivateWarehouses.updateCreditsWithWarehouse(
      tenantId,
      primaryWarehouse
    );
  };
}
