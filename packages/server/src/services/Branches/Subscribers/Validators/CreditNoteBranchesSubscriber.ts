import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  ICreditNoteCreatingPayload,
  ICreditNoteEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class CreditNoteBranchValidateSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.creditNote.onCreating,
      this.validateBranchExistenceOnCreditCreating
    );
    bus.subscribe(
      events.creditNote.onEditing,
      this.validateBranchExistenceOnCreditEditing
    );
    return bus;
  };

  /**
   * Validate branch existence on estimate creating.
   * @param {ICreditNoteCreatingPayload} payload
   */
  private validateBranchExistenceOnCreditCreating = async ({
    tenantId,
    creditNoteDTO,
  }: ICreditNoteCreatingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      creditNoteDTO.branchId
    );
  };

  /**
   * Validate branch existence once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistenceOnCreditEditing = async ({
    creditNoteEditDTO,
    tenantId,
  }: ICreditNoteEditingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      creditNoteEditDTO.branchId
    );
  };
}
