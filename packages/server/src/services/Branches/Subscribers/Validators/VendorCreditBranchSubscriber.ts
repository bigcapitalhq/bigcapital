import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IVendorCreditCreatingPayload,
  IVendorCreditEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistance } from '../../Integrations/ValidateBranchExistance';

@Service()
export class VendorCreditBranchValidateSubscriber {
  @Inject()
  private validateBranchExistance: ValidateBranchExistance;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.vendorCredit.onCreating,
      this.validateBranchExistanceOnCreditCreating
    );
    bus.subscribe(
      events.vendorCredit.onEditing,
      this.validateBranchExistanceOnCreditEditing
    );
    return bus;
  };

  /**
   * Validate branch existance on estimate creating.
   * @param {ISaleEstimateCreatedPayload} payload
   */
  private validateBranchExistanceOnCreditCreating = async ({
    tenantId,
    vendorCreditCreateDTO,
  }: IVendorCreditCreatingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      vendorCreditCreateDTO.branchId
    );
  };

  /**
   * Validate branch existance once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistanceOnCreditEditing = async ({
    vendorCreditDTO,
    tenantId,
  }: IVendorCreditEditingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      vendorCreditDTO.branchId
    );
  };
}
