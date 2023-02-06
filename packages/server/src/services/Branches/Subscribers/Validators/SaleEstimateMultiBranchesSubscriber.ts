import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  ISaleEstimateCreatingPayload,
  ISaleEstimateEditingPayload,
} from '@/interfaces';
import { ValidateBranchExistance } from '../../Integrations/ValidateBranchExistance';

@Service()
export class SaleEstimateBranchValidateSubscriber {
  @Inject()
  private validateBranchExistance: ValidateBranchExistance;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.saleEstimate.onCreating,
      this.validateBranchExistanceOnEstimateCreating
    );
    bus.subscribe(
      events.saleEstimate.onEditing,
      this.validateBranchExistanceOnEstimateEditing
    );
    return bus;
  };

  /**
   * Validate branch existance on estimate creating.
   * @param {ISaleEstimateCreatedPayload} payload
   */
  private validateBranchExistanceOnEstimateCreating = async ({
    tenantId,
    estimateDTO,
  }: ISaleEstimateCreatingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      estimateDTO.branchId
    );
  };

  /**
   * Validate branch existance once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistanceOnEstimateEditing = async ({
    estimateDTO,
    tenantId,
  }: ISaleEstimateEditingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      estimateDTO.branchId
    );
  };
}
