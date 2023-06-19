import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { ICommandCashflowCreatingPayload } from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class CashflowBranchDTOValidatorSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.cashflow.onTransactionCreating,
      this.validateBranchExistenceOnCashflowTransactionCreating
    );
    return bus;
  };

  /**
   * Validate branch existence once cashflow transaction creating.
   * @param {ICommandCashflowCreatingPayload} payload
   */
  private validateBranchExistenceOnCashflowTransactionCreating = async ({
    tenantId,
    newTransactionDTO,
  }: ICommandCashflowCreatingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      newTransactionDTO.branchId
    );
  };
}
