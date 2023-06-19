import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { IBillCreatingPayload, IBillEditingPayload } from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class BillBranchValidateSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.bill.onCreating,
      this.validateBranchExistenceOnBillCreating
    );
    bus.subscribe(
      events.bill.onEditing,
      this.validateBranchExistenceOnBillEditing
    );
    return bus;
  };

  /**
   * Validate branch existence on estimate creating.
   * @param {ISaleEstimateCreatedPayload} payload
   */
  private validateBranchExistenceOnBillCreating = async ({
    tenantId,
    billDTO,
  }: IBillCreatingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      billDTO.branchId
    );
  };

  /**
   * Validate branch existence once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistenceOnBillEditing = async ({
    billDTO,
    tenantId,
  }: IBillEditingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      billDTO.branchId
    );
  };
}
