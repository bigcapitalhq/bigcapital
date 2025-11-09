import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ValidateBranchExistance } from '../../integrations/ValidateBranchExistance';
import { events } from '@/common/events/events';
import { IRefundCreditNoteCreatingPayload } from '@/modules/CreditNoteRefunds/types/CreditNoteRefunds.types';

@Injectable()
export class CreditNoteRefundBranchValidateSubscriber {
  constructor(
    private readonly validateBranchExistance: ValidateBranchExistance
  ) { }

  /**
   * Validate branch existance on refund credit note creating.
   * @param {IRefundCreditNoteCreatingPayload} payload
   */
  @OnEvent(events.creditNote.onRefundCreating)
  async validateBranchExistanceOnCreditRefundCreating({
    newCreditNoteDTO,
  }: IRefundCreditNoteCreatingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      newCreditNoteDTO.branchId
    );
  }
}
