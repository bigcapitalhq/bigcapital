import { Inject, Service } from 'typedi';
import {
  ISaleReceiptCreatingPayload,
  ISaleReceiptEditingPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';

@Service()
export class SaleReceiptWarehousesValidateSubscriber {
  @Inject()
  private warehousesDTOValidator: WarehousesDTOValidators;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleReceipt.onCreating,
      this.validateSaleReceiptWarehouseExistenceOnCreating
    );
    bus.subscribe(
      events.saleReceipt.onEditing,
      this.validateSaleReceiptWarehouseExistenceOnEditing
    );
    return bus;
  }

  /**
   * Validate warehouse existence of sale invoice once creating.
   * @param {ISaleReceiptCreatingPayload}
   */
  private validateSaleReceiptWarehouseExistenceOnCreating = async ({
    saleReceiptDTO,
    tenantId,
  }: ISaleReceiptCreatingPayload) => {
    await this.warehousesDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      saleReceiptDTO
    );
  };

  /**
   * Validate warehouse existence of sale invoice once editing.
   * @param {ISaleReceiptEditingPayload}
   */
  private validateSaleReceiptWarehouseExistenceOnEditing = async ({
    tenantId,
    saleReceiptDTO,
  }: ISaleReceiptEditingPayload) => {
    await this.warehousesDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      saleReceiptDTO
    );
  };
}
