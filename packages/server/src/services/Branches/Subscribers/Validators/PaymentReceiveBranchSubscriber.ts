import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IPaymentReceiveCreatingPayload,
  IPaymentReceiveEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class PaymentReceiveBranchValidateSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.paymentReceive.onCreating,
      this.validateBranchExistenceOnPaymentCreating
    );
    bus.subscribe(
      events.paymentReceive.onEditing,
      this.validateBranchExistenceOnPaymentEditing
    );
    return bus;
  };

  /**
   * Validate branch existence on estimate creating.
   * @param {IPaymentReceiveCreatingPayload} payload
   */
  private validateBranchExistenceOnPaymentCreating = async ({
    tenantId,
    paymentReceiveDTO,
  }: IPaymentReceiveCreatingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      paymentReceiveDTO.branchId
    );
  };

  /**
   * Validate branch existence once estimate editing.
   * @param {IPaymentReceiveEditingPayload} payload
   */
  private validateBranchExistenceOnPaymentEditing = async ({
    paymentReceiveDTO,
    tenantId,
  }: IPaymentReceiveEditingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      paymentReceiveDTO.branchId
    );
  };
}
