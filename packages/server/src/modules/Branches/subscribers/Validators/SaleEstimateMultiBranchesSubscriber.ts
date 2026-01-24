import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import {
  ISaleEstimateCreatingPayload,
  ISaleEstimateEditingPayload,
} from '@/modules/SaleEstimates/types/SaleEstimates.types';
import { ValidateBranchExistance } from '../../integrations/ValidateBranchExistance';

@Injectable()
export class SaleEstimateBranchValidateSubscriber {
  constructor(
    private readonly validateBranchExistance: ValidateBranchExistance,
  ) { }

  /**
   * Validate branch existance on estimate creating.
   * @param {ISaleEstimateCreatedPayload} payload
   */
  @OnEvent(events.saleEstimate.onCreating, { suppressErrors: false })
  async validateBranchExistanceOnEstimateCreating({
    estimateDTO,
  }: ISaleEstimateCreatingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      estimateDTO.branchId,
    );
  }

  /**
   * Validate branch existance once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  @OnEvent(events.saleEstimate.onEditing, { suppressErrors: false })
  async validateBranchExistanceOnEstimateEditing({
    estimateDTO,
  }: ISaleEstimateEditingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      estimateDTO.branchId,
    );
  }
}
