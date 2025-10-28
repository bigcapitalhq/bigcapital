import {
  ISaleReceiptCreatingPayload,
  ISaleReceiptEditingPayload,
} from '@/modules/SaleReceipts/types/SaleReceipts.types';
import { events } from '@/common/events/events';
import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaleReceiptWarehousesValidateSubscriber {
  constructor(
    private readonly warehousesDTOValidator: WarehousesDTOValidators,
  ) {}

  /**
   * Validate warehouse existance of sale invoice once creating.
   * @param {ISaleReceiptCreatingPayload}
   */
  @OnEvent(events.saleReceipt.onCreating)
  async validateSaleReceiptWarehouseExistanceOnCreating({
    saleReceiptDTO,
  }: ISaleReceiptCreatingPayload) {
    await this.warehousesDTOValidator.validateDTOWarehouseWhenActive(
      saleReceiptDTO,
    );
  }

  /**
   * Validate warehouse existance of sale invoice once editing.
   * @param {ISaleReceiptEditingPayload}
   */
  @OnEvent(events.saleReceipt.onEditing)
  async validateSaleReceiptWarehouseExistanceOnEditing({
    saleReceiptDTO,
  }: ISaleReceiptEditingPayload) {
    await this.warehousesDTOValidator.validateDTOWarehouseWhenActive(
      saleReceiptDTO,
    );
  }
}
