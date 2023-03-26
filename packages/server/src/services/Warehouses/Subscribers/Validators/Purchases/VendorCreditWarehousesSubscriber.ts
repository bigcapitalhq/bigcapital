import { Inject, Service } from 'typedi';
import {
  IVendorCreditCreatingPayload,
  IVendorCreditEditingPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';

@Service()
export class VendorCreditWarehousesValidateSubscriber {
  @Inject()
  warehouseDTOValidator: WarehousesDTOValidators;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.vendorCredit.onCreating,
      this.validateVendorCreditWarehouseExistanceOnCreating
    );
    bus.subscribe(
      events.vendorCredit.onEditing,
      this.validateSaleEstimateWarehouseExistanceOnEditing
    );
    return bus;
  }

  /**
   * Validate warehouse existance of sale invoice once creating.
   * @param {IVendorCreditCreatingPayload}
   */
  private validateVendorCreditWarehouseExistanceOnCreating = async ({
    vendorCreditCreateDTO,
    tenantId,
  }: IVendorCreditCreatingPayload) => {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      vendorCreditCreateDTO
    );
  };

  /**
   * Validate warehouse existance of sale invoice once editing.
   * @param {IVendorCreditEditingPayload}
   */
  private validateSaleEstimateWarehouseExistanceOnEditing = async ({
    tenantId,
    vendorCreditDTO,
  }: IVendorCreditEditingPayload) => {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      vendorCreditDTO
    );
  };
}
