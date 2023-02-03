import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { IBillCreatingPayload, IBillEditingPayload } from '@/interfaces';
import { ValidateBranchExistance } from '../../Integrations/ValidateBranchExistance';

@Service()
export class BillBranchValidateSubscriber {
  @Inject()
  private validateBranchExistance: ValidateBranchExistance;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.bill.onCreating,
      this.validateBranchExistanceOnBillCreating
    );
    bus.subscribe(
      events.bill.onEditing,
      this.validateBranchExistanceOnBillEditing
    );
    return bus;
  };

  /**
   * Validate branch existance on estimate creating.
   * @param {ISaleEstimateCreatedPayload} payload
   */
  private validateBranchExistanceOnBillCreating = async ({
    tenantId,
    billDTO,
  }: IBillCreatingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      billDTO.branchId
    );
  };

  /**
   * Validate branch existance once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistanceOnBillEditing = async ({
    billDTO,
    tenantId,
  }: IBillEditingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      billDTO.branchId
    );
  };
}
