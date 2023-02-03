import { Inject, Service } from 'typedi';
import {
  ISaleEstimateCreatingPayload,
  ISaleEstimateEditingPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';

@Service()
export class SaleEstimateWarehousesValidateSubscriber {
  @Inject()
  warehouseDTOValidator: WarehousesDTOValidators;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleEstimate.onCreating,
      this.validateSaleEstimateWarehouseExistanceOnCreating
    );
    bus.subscribe(
      events.saleEstimate.onEditing,
      this.validateSaleEstimateWarehouseExistanceOnEditing
    );
    return bus;
  }

  /**
   * Validate warehouse existance of sale invoice once creating.
   * @param {ISaleEstimateCreatingPayload}
   */
  private validateSaleEstimateWarehouseExistanceOnCreating = async ({
    estimateDTO,
    tenantId,
  }: ISaleEstimateCreatingPayload) => {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      estimateDTO
    );
  };

  /**
   * Validate warehouse existance of sale invoice once editing.
   * @param {ISaleEstimateEditingPayload}
   */
  private validateSaleEstimateWarehouseExistanceOnEditing = async ({
    tenantId,
    estimateDTO,
  }: ISaleEstimateEditingPayload) => {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      estimateDTO
    );
  };
}
