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
      this.validateSaleEstimateWarehouseExistenceOnCreating
    );
    bus.subscribe(
      events.saleEstimate.onEditing,
      this.validateSaleEstimateWarehouseExistenceOnEditing
    );
    return bus;
  }

  /**
   * Validate warehouse existence of sale invoice once creating.
   * @param {ISaleEstimateCreatingPayload}
   */
  private validateSaleEstimateWarehouseExistenceOnCreating = async ({
    estimateDTO,
    tenantId,
  }: ISaleEstimateCreatingPayload) => {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      estimateDTO
    );
  };

  /**
   * Validate warehouse existence of sale invoice once editing.
   * @param {ISaleEstimateEditingPayload}
   */
  private validateSaleEstimateWarehouseExistenceOnEditing = async ({
    tenantId,
    estimateDTO,
  }: ISaleEstimateEditingPayload) => {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      estimateDTO
    );
  };
}
