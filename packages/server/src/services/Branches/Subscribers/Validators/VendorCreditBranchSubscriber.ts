import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IVendorCreditCreatingPayload,
  IVendorCreditEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class VendorCreditBranchValidateSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.vendorCredit.onCreating,
      this.validateBranchExistenceOnCreditCreating
    );
    bus.subscribe(
      events.vendorCredit.onEditing,
      this.validateBranchExistenceOnCreditEditing
    );
    return bus;
  };

  /**
   * Validate branch existence on estimate creating.
   * @param {ISaleEstimateCreatedPayload} payload
   */
  private validateBranchExistenceOnCreditCreating = async ({
    tenantId,
    vendorCreditCreateDTO,
  }: IVendorCreditCreatingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      vendorCreditCreateDTO.branchId
    );
  };

  /**
   * Validate branch existence once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistenceOnCreditEditing = async ({
    vendorCreditDTO,
    tenantId,
  }: IVendorCreditEditingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      vendorCreditDTO.branchId
    );
  };
}
