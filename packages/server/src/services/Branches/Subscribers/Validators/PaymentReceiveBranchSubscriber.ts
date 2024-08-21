import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IPaymentReceivedCreatingPayload,
  IPaymentReceivedEditingPayload,
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
   * @param {IPaymentReceivedCreatingPayload} payload
   */
  private validateBranchExistanceOnPaymentCreating = async ({
    tenantId,
    paymentReceiveDTO,
  }: IPaymentReceivedCreatingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      paymentReceiveDTO.branchId
    );
  };

  /**
   * Validate branch existance once estimate editing.
   * @param {IPaymentReceivedEditingPayload} payload
   */
  private validateBranchExistanceOnPaymentEditing = async ({
    paymentReceiveDTO,
    tenantId,
  }: IPaymentReceivedEditingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      paymentReceiveDTO.branchId
    );
  };
}
