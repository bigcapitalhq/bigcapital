import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { IRefundCreditNoteCreatingPayload } from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class CreditNoteRefundBranchValidateSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.creditNote.onRefundCreating,
      this.validateBranchExistenceOnCreditRefundCreating
    );
    return bus;
  };

  /**
   * Validate branch existence on refund credit note creating.
   * @param {ICreditNoteCreatingPayload} payload
   */
  private validateBranchExistenceOnCreditRefundCreating = async ({
    tenantId,
    newCreditNoteDTO,
  }: IRefundCreditNoteCreatingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      newCreditNoteDTO.branchId
    );
  };
}
