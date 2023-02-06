import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IPaymentReceiveCreatingPayload,
  IPaymentReceiveEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistance } from '../../Integrations/ValidateBranchExistance';

@Service()
export class PaymentReceiveBranchValidateSubscriber {
  @Inject()
  private validateBranchExistance: ValidateBranchExistance;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.paymentReceive.onCreating,
      this.validateBranchExistanceOnPaymentCreating
    );
    bus.subscribe(
      events.paymentReceive.onEditing,
      this.validateBranchExistanceOnPaymentEditing
    );
    return bus;
  };

  /**
   * Validate branch existance on estimate creating.
   * @param {IPaymentReceiveCreatingPayload} payload
   */
  private validateBranchExistanceOnPaymentCreating = async ({
    tenantId,
    paymentReceiveDTO,
  }: IPaymentReceiveCreatingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      paymentReceiveDTO.branchId
    );
  };

  /**
   * Validate branch existance once estimate editing.
   * @param {IPaymentReceiveEditingPayload} payload
   */
  private validateBranchExistanceOnPaymentEditing = async ({
    paymentReceiveDTO,
    tenantId,
  }: IPaymentReceiveEditingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      paymentReceiveDTO.branchId
    );
  };
}
