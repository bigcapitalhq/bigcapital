import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  ISaleEstimateCreatingPayload,
  ISaleEstimateEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class SaleEstimateBranchValidateSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.saleEstimate.onCreating,
      this.validateBranchExistenceOnEstimateCreating
    );
    bus.subscribe(
      events.saleEstimate.onEditing,
      this.validateBranchExistenceOnEstimateEditing
    );
    return bus;
  };

  /**
   * Validate branch existence on estimate creating.
   * @param {ISaleEstimateCreatedPayload} payload
   */
  private validateBranchExistenceOnEstimateCreating = async ({
    tenantId,
    estimateDTO,
  }: ISaleEstimateCreatingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      estimateDTO.branchId
    );
  };

  /**
   * Validate branch existence once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistenceOnEstimateEditing = async ({
    estimateDTO,
    tenantId,
  }: ISaleEstimateEditingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      estimateDTO.branchId
    );
  };
}
