import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ValidateBranchExistance } from '../../integrations/ValidateBranchExistance';
import { IInventoryAdjustmentCreatingPayload } from '@/modules/InventoryAdjutments/types/InventoryAdjustments.types';

@Injectable()
export class InventoryAdjustmentBranchValidateSubscriber {
  constructor(
    private readonly validateBranchExistance: ValidateBranchExistance,
  ) { }

  /**
   * Validate branch existance on inventory adjustment creating.
   * @param {IInventoryAdjustmentCreatingPayload} payload
   */
  @OnEvent(events.inventoryAdjustment.onQuickCreating)
  async validateBranchExistanceOnInventoryCreating({
    quickAdjustmentDTO,
  }: IInventoryAdjustmentCreatingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      quickAdjustmentDTO.branchId,
    );
  }
}
