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
      this.validateBillWarehouseExistenceOnCreating
    );
    bus.subscribe(
      events.bill.onEditing,
      this.validateSaleEstimateWarehouseExistenceOnEditing
    );
    return bus;
  }

  /**
   * Validate warehouse existence of sale invoice once creating.
   * @param {IBillCreatingPayload}
   */
  private validateBillWarehouseExistenceOnCreating = async ({
    billDTO,
    tenantId,
  }: IBillCreatingPayload) => {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      billDTO
    );
  };

  /**
   * Validate warehouse existence of sale invoice once editing.
   * @param {IBillEditingPayload}
   */
  private validateSaleEstimateWarehouseExistenceOnEditing = async ({
    tenantId,
    billDTO,
  }: IBillEditingPayload) => {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      billDTO
    );
  };
}
