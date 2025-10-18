import {
  IVendorCreditCreatingPayload,
  IVendorCreditEditingPayload,
} from '@/modules/VendorCredit/types/VendorCredit.types';
import { ValidateBranchExistance } from '../../integrations/ValidateBranchExistance';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';

@Injectable()
export class VendorCreditBranchValidateSubscriber {
  constructor(
    private readonly validateBranchExistance: ValidateBranchExistance,
  ) { }

  /**
   * Validate branch existance on estimate creating.
   * @param {ISaleEstimateCreatedPayload} payload
   */
  @OnEvent(events.vendorCredit.onCreating)
  async validateBranchExistanceOnCreditCreating({
    vendorCreditCreateDTO,
  }: IVendorCreditCreatingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      vendorCreditCreateDTO.branchId,
    );
  }

  /**
   * Validate branch existance once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  @OnEvent(events.vendorCredit.onEditing)
  async validateBranchExistanceOnCreditEditing({
    vendorCreditDTO,
  }: IVendorCreditEditingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      vendorCreditDTO.branchId,
    );
  }
}
