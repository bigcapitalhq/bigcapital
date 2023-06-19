import { Inject, Service } from 'typedi';
import {
  ISaleInvoiceCreatingPaylaod,
  ISaleInvoiceEditingPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';

@Service()
export class SaleInvoicesWarehousesValidateSubscriber {
  @Inject()
  warehousesDTOValidator: WarehousesDTOValidators;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreating,
      this.validateSaleInvoiceWarehouseExistenceOnCreating
    );
    bus.subscribe(
      events.saleInvoice.onEditing,
      this.validateSaleInvoiceWarehouseExistenceOnEditing
    );
    return bus;
  }

  /**
   * Validate warehouse existence of sale invoice once creating.
   * @param {ISaleInvoiceCreatingPaylaod}
   */
  private validateSaleInvoiceWarehouseExistenceOnCreating = async ({
    saleInvoiceDTO,
    tenantId,
  }: ISaleInvoiceCreatingPaylaod) => {
    await this.warehousesDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      saleInvoiceDTO
    );
  };

  /**
   * Validate warehouse existence of sale invoice once editing.
   * @param {ISaleInvoiceEditingPayload}
   */
  private validateSaleInvoiceWarehouseExistenceOnEditing = async ({
    tenantId,
    saleInvoiceDTO,
  }: ISaleInvoiceEditingPayload) => {
    await this.warehousesDTOValidator.validateDTOWarehouseWhenActive(
      tenantId,
      saleInvoiceDTO
    );
  };
}
