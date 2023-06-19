import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { IRefundVendorCreditCreatingPayload } from '@/interfaces';
import { ValidateBranchExistence } from '../../Integrations/ValidateBranchExistence';

@Service()
export class VendorCreditRefundBranchValidateSubscriber {
  @Inject()
  private validateBranchExistence: ValidateBranchExistence;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.vendorCredit.onRefundCreating,
      this.validateBranchExistenceOnCreditRefundCreating
    );
    return bus;
  };

  /**
   * Validate branch existence on refund credit note creating.
   * @param {IRefundVendorCreditCreatingPayload} payload
   */
  private validateBranchExistenceOnCreditRefundCreating = async ({
    tenantId,
    refundVendorCreditDTO,
  }: IRefundVendorCreditCreatingPayload) => {
    await this.validateBranchExistence.validateTransactionBranchWhenActive(
      tenantId,
      refundVendorCreditDTO.branchId
    );
  };
}
