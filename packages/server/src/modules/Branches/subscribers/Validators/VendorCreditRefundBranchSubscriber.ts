import { ValidateBranchExistance } from '../../integrations/ValidateBranchExistance';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { IRefundVendorCreditCreatingPayload } from '@/modules/VendorCreditsRefund/types/VendorCreditRefund.types';

@Injectable()
export class VendorCreditRefundBranchValidateSubscriber {
  constructor(
    private readonly validateBranchExistance: ValidateBranchExistance,
  ) { }

  /**
   * Validate branch existance on refund credit note creating.
   * @param {IRefundVendorCreditCreatingPayload} payload
   */
  @OnEvent(events.vendorCredit.onRefundCreating)
  async validateBranchExistanceOnCreditRefundCreating({
    refundVendorCreditDTO,
  }: IRefundVendorCreditCreatingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      refundVendorCreditDTO.branchId,
    );
  }
}
