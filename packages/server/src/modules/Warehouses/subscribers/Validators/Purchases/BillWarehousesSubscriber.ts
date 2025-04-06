import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';
import { IBillEditingPayload } from '@/modules/Bills/Bills.types';
import { Injectable } from '@nestjs/common';
import { IBillCreatingPayload } from '@/modules/Bills/Bills.types';

@Injectable()
export class BillWarehousesValidateSubscriber {
  constructor(
    private readonly warehouseDTOValidator: WarehousesDTOValidators,
  ) {}

  /**
   * Validate warehouse existance of sale invoice once creating.
   * @param {IBillCreatingPayload}
   */
  @OnEvent(events.bill.onCreating)
  async validateBillWarehouseExistanceOnCreating({
    billDTO,
  }: IBillCreatingPayload) {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(billDTO);
  }

  /**
   * Validate warehouse existance of sale invoice once editing.
   * @param {IBillEditingPayload}
   */

  @OnEvent(events.bill.onEditing)
  async validateSaleEstimateWarehouseExistanceOnEditing({
    billDTO,
  }: IBillEditingPayload) {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(billDTO);
  }
}
