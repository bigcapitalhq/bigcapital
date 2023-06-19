import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IBillPaymentCreatingPayload,
  IBillPaymentEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class PaymentMadeBranchValidateSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.billPayment.onCreating,
      this.validateBranchExistenceOnPaymentCreating
    );
    bus.subscribe(
      events.billPayment.onEditing,
      this.validateBranchExistenceOnPaymentEditing
    );
    return bus;
  };

  /**
   * Validate branch existence on estimate creating.
   * @param {ISaleEstimateCreatedPayload} payload
   */
  private validateBranchExistenceOnPaymentCreating = async ({
    tenantId,
    billPaymentDTO,
  }: IBillPaymentCreatingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      billPaymentDTO.branchId
    );
  };

  /**
   * Validate branch existence once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistenceOnPaymentEditing = async ({
    billPaymentDTO,
    tenantId,
  }: IBillPaymentEditingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      billPaymentDTO.branchId
    );
  };
}