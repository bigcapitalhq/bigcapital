import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { IRefundCreditNoteCreatingPayload } from '@/interfaces';
import { ValidateBranchExistance } from '../../Integrations/ValidateBranchExistance';

@Service()
export class CreditNoteRefundBranchValidateSubscriber {
  @Inject()
  private validateBranchExistance: ValidateBranchExistance;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.creditNote.onRefundCreating,
      this.validateBranchExistanceOnCreditRefundCreating
    );
    return bus;
  };

  /**
   * Validate branch existance on refund credit note creating.
   * @param {ICreditNoteCreatingPayload} payload
   */
  private validateBranchExistanceOnCreditRefundCreating = async ({
    tenantId,
    newCreditNoteDTO,
  }: IRefundCreditNoteCreatingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      newCreditNoteDTO.branchId
    );
  };
}
