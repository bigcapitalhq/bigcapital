import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ValidateBranchExistance } from '../../integrations/ValidateBranchExistance';
import { ICreditNoteEditingPayload } from '@/modules/CreditNotes/types/CreditNotes.types';
import { ICreditNoteCreatingPayload } from '@/modules/CreditNotes/types/CreditNotes.types';

@Injectable()
export class CreditNoteBranchValidateSubscriber {
  constructor(
    private readonly validateBranchExistance: ValidateBranchExistance,
  ) { }

  /**
   * Validate branch existance on credit note creating.
   * @param {ICreditNoteCreatingPayload} payload
   */
  @OnEvent(events.creditNote.onCreating)
  async validateBranchExistanceOnCreditCreating({
    creditNoteDTO,
  }: ICreditNoteCreatingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      creditNoteDTO.branchId,
    );
  }

  /**
   * Validate branch existance once credit note editing.
   * @param {ICreditNoteEditingPayload} payload
   */
  @OnEvent(events.creditNote.onEditing)
  async validateBranchExistanceOnCreditEditing({
    creditNoteEditDTO,
  }: ICreditNoteEditingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      creditNoteEditDTO.branchId,
    );
  }
}
