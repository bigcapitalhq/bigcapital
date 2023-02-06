import { Inject, Service } from 'typedi';
import { IBillCreatingPayload, IBillEditingPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';

@Service()
export class BillWarehousesValidateSubscriber {
  @Inject()
  private warehouseDTOValidator: WarehousesDTOValidators;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.bill.onCreating,
      this.validateBillWarehouseExistanceOnCreating
    );
    bus.subscribe(
      events.bill.onEditing,
      this.validateSaleEstimateWarehouseExistanceOnEditing
    );
    return bus;
  }

  /**
   * Validate warehouse existance of sale invoice once creating.
   * @param {IBillCreatingPayload}
   */
  private validateBillWarehouseExistanceOnCreating = async ({
    billDTO,
    tenantId,
  }: IBillCreatingPayload) => {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      billDTO
    );
  };

  /**
   * Validate warehouse existance of sale invoice once editing.
   * @param {IBillEditingPayload}
   */
  private validateSaleEstimateWarehouseExistanceOnEditing = async ({
    tenantId,
    billDTO,
  }: IBillEditingPayload) => {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      billDTO
    );
  };
}
