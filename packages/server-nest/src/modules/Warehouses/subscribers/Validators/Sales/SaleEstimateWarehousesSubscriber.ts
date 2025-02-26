import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { ISaleEstimateEditingPayload } from '@/modules/SaleEstimates/types/SaleEstimates.types';
import { ISaleEstimateCreatingPayload } from '@/modules/SaleEstimates/types/SaleEstimates.types';

@Injectable()
export class SaleEstimateWarehousesValidateSubscriber {
  constructor(
    private readonly warehouseDTOValidator: WarehousesDTOValidators,
  ) {}

  /**
   * Validate warehouse existance of sale invoice once creating.
   * @param {ISaleEstimateCreatingPayload}
   */
  @OnEvent(events.saleEstimate.onCreating)
  async validateSaleEstimateWarehouseExistanceOnCreating({
    estimateDTO,
  }: ISaleEstimateCreatingPayload) {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      estimateDTO,
    );
  }

  /**
   * Validate warehouse existance of sale invoice once editing.
   * @param {ISaleEstimateEditingPayload}
   */
  @OnEvent(events.saleEstimate.onEditing)
  async validateSaleEstimateWarehouseExistanceOnEditing({
    estimateDTO,
  }: ISaleEstimateEditingPayload) {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      estimateDTO,
    );
  }
}
