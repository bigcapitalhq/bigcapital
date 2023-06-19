import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { IInventoryAdjustmentCreatingPayload } from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class InventoryAdjustmentBranchValidateSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.inventoryAdjustment.onQuickCreating,
      this.validateBranchExistenceOnInventoryCreating
    );
    return bus;
  };

  /**
   * Validate branch existence on invoice creating.
   * @param {ISaleInvoiceCreatingPayload} payload
   */
  private validateBranchExistenceOnInventoryCreating = async ({
    tenantId,
    quickAdjustmentDTO,
  }: IInventoryAdjustmentCreatingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      quickAdjustmentDTO.branchId
    );
  };
}
