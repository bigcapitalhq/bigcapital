import { IInventoryAdjustmentCreatingPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';

@Service()
export class InventoryAdjustmentWarehouseValidatorSubscriber {
  @Inject()
  private warehouseDTOValidator: WarehousesDTOValidators;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(events.inventoryAdjustment.onQuickCreating, this.validateAdjustmentWarehouseExistanceOnCreating);
    return bus;
  }

  /**
   * Validate warehouse existance of sale invoice once creating.
   * @param {IBillCreatingPayload}
   */
  private validateAdjustmentWarehouseExistanceOnCreating = async ({
    quickAdjustmentDTO,
    tenantId,
  }: IInventoryAdjustmentCreatingPayload) => {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(tenantId, quickAdjustmentDTO);
  };
}
