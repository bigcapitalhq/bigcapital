import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { IVendorCreditEditingPayload } from '@/modules/VendorCredit/types/VendorCredit.types';
import { events } from '@/common/events/events';
import { IVendorCreditCreatingPayload } from '@/modules/VendorCredit/types/VendorCredit.types';

@Injectable()
export class VendorCreditWarehousesValidateSubscriber {
  constructor(
    private readonly warehouseDTOValidator: WarehousesDTOValidators,
  ) {}

  /**
   * Validate warehouse existance of sale invoice once creating.
   * @param {IVendorCreditCreatingPayload}
   */
  @OnEvent(events.vendorCredit.onCreating)
  async validateVendorCreditWarehouseExistanceOnCreating({
    vendorCreditCreateDTO,
  }: IVendorCreditCreatingPayload) {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      vendorCreditCreateDTO,
    );
  }

  /**
   * Validate warehouse existance of sale invoice once editing.
   * @param {IVendorCreditEditingPayload}
   */
  @OnEvent(events.vendorCredit.onEditing)
  async validateSaleEstimateWarehouseExistanceOnEditing({
    vendorCreditDTO,
  }: IVendorCreditEditingPayload) {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      vendorCreditDTO,
    );
  }
}
