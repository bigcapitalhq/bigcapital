import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IBillPaymentCreatingPayload,
  IBillPaymentEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistance } from '../../Integrations/ValidateBranchExistance';

@Service()
export class PaymentMadeBranchValidateSubscriber {
  @Inject()
  private validateBranchExistance: ValidateBranchExistance;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.billPayment.onCreating,
      this.validateBranchExistanceOnPaymentCreating
    );
    bus.subscribe(
      events.billPayment.onEditing,
      this.validateBranchExistanceOnPaymentEditing
    );
    return bus;
  };

  /**
   * Validate branch existance on estimate creating.
   * @param {ISaleEstimateCreatedPayload} payload
   */
  private validateBranchExistanceOnPaymentCreating = async ({
    tenantId,
    billPaymentDTO,
  }: IBillPaymentCreatingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      billPaymentDTO.branchId
    );
  };

  /**
   * Validate branch existance once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistanceOnPaymentEditing = async ({
    billPaymentDTO,
    tenantId,
  }: IBillPaymentEditingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      billPaymentDTO.branchId
    );
  };
}