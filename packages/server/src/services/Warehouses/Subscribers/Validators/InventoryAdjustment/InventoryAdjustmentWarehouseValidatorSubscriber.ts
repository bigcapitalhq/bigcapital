import { Inject, Service } from 'typedi';
import { IInventoryAdjustmentCreatingPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';

@Service()
export class InventoryAdjustmentWarehouseValidatorSubscriber {
  @Inject()
  private warehouseDTOValidator: WarehousesDTOValidators;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.inventoryAdjustment.onQuickCreating,
      this.validateAdjustmentWarehouseExistenceOnCreating
    );
    return bus;
  }

  /**
   * Validate warehouse existence of sale invoice once creating.
   * @param {IBillCreatingPayload}
   */
  private validateAdjustmentWarehouseExistenceOnCreating = async ({
    quickAdjustmentDTO,
    tenantId,
  }: IInventoryAdjustmentCreatingPayload) => {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      quickAdjustmentDTO
    );
  };
}
