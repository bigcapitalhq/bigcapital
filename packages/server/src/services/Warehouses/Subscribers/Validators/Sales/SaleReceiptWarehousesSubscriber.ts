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
      this.validateSaleReceiptWarehouseExistanceOnCreating
    );
    bus.subscribe(
      events.saleReceipt.onEditing,
      this.validateSaleReceiptWarehouseExistanceOnEditing
    );
    return bus;
  }

  /**
   * Validate warehouse existance of sale invoice once creating.
   * @param {ISaleReceiptCreatingPayload}
   */
  private validateSaleReceiptWarehouseExistanceOnCreating = async ({
    saleReceiptDTO,
    tenantId,
  }: ISaleReceiptCreatingPayload) => {
    await this.warehousesDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      saleReceiptDTO
    );
  };

  /**
   * Validate warehouse existance of sale invoice once editing.
   * @param {ISaleReceiptEditingPayload}
   */
  private validateSaleReceiptWarehouseExistanceOnEditing = async ({
    tenantId,
    saleReceiptDTO,
  }: ISaleReceiptEditingPayload) => {
    await this.warehousesDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      saleReceiptDTO
    );
  };
}
