import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  ICreditNoteCreatingPayload,
  ICreditNoteEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistance } from '../../Integrations/ValidateBranchExistance';

@Service()
export class CreditNoteBranchValidateSubscriber {
  @Inject()
  private validateBranchExistance: ValidateBranchExistance;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.creditNote.onCreating,
      this.validateBranchExistanceOnCreditCreating
    );
    bus.subscribe(
      events.creditNote.onEditing,
      this.validateBranchExistanceOnCreditEditing
    );
    return bus;
  };

  /**
   * Validate branch existance on estimate creating.
   * @param {ICreditNoteCreatingPayload} payload
   */
  private validateBranchExistanceOnCreditCreating = async ({
    tenantId,
    creditNoteDTO,
  }: ICreditNoteCreatingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      creditNoteDTO.branchId
    );
  };

  /**
   * Validate branch existance once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistanceOnCreditEditing = async ({
    creditNoteEditDTO,
    tenantId,
  }: ICreditNoteEditingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      creditNoteEditDTO.branchId
    );
  };
}
