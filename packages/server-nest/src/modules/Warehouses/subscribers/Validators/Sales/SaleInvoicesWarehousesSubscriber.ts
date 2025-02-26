import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  ISaleInvoiceCreatingPaylaod,
  ISaleInvoiceEditingPayload,
} from '@/modules/SaleInvoices/SaleInvoice.types';
import { events } from '@/common/events/events';

@Injectable()
export class SaleInvoicesWarehousesValidateSubscriber {
  constructor(
    private readonly warehousesDTOValidator: WarehousesDTOValidators,
  ) {}

  /**
  /**
   * Validate warehouse existance of sale invoice once creating.
   * @param {ISaleInvoiceCreatingPaylaod}
   */
  @OnEvent(events.saleInvoice.onCreating)
  async validateSaleInvoiceWarehouseExistanceOnCreating({
    saleInvoiceDTO,
  }: ISaleInvoiceCreatingPaylaod) {
    await this.warehousesDTOValidator.validateDTOWarehouseWhenActive(
      saleInvoiceDTO,
    );
  }

  /**
   * Validate warehouse existance of sale invoice once editing.
   * @param {ISaleInvoiceEditingPayload}
   */
  @OnEvent(events.saleInvoice.onEditing)
  async validateSaleInvoiceWarehouseExistanceOnEditing({
    saleInvoiceDTO,
  }: ISaleInvoiceEditingPayload) {
    await this.warehousesDTOValidator.validateDTOWarehouseWhenActive(
      saleInvoiceDTO,
    );
  }
}
