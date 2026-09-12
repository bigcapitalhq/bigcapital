import { WarehousesDTOValidators } from '../../../Integrations/WarehousesDTOValidators';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  IInventoryAdjustmentCreatingPayload,
  IInventoryAdjustmentEditingPayload,
} from '@/modules/InventoryAdjutments/types/InventoryAdjustments.types';
import { events } from '@/common/events/events';

@Injectable()
export class InventoryAdjustmentWarehouseValidatorSubscriber {
  constructor(
    private readonly warehouseDTOValidator: WarehousesDTOValidators,
  ) {}

  /**
   * Validate warehouse existance of sale invoice once creating.
   * @param {IBillCreatingPayload}
   */
  @OnEvent(events.inventoryAdjustment.onQuickCreating)
  async validateAdjustmentWarehouseExistanceOnCreating({
    quickAdjustmentDTO,
  }: IInventoryAdjustmentCreatingPayload) {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      quickAdjustmentDTO,
    );
  }

  /**
   * Validate warehouse existance of the inventory adjustment once editing.
   * @param {IInventoryAdjustmentEditingPayload} payload
   */
  @OnEvent(events.inventoryAdjustment.onEditing)
  async validateAdjustmentWarehouseExistanceOnEditing({
    quickAdjustmentDTO,
  }: IInventoryAdjustmentEditingPayload) {
    await this.warehouseDTOValidator.validateDTOWarehouseWhenActive(
      quickAdjustmentDTO,
    );
  }
}
