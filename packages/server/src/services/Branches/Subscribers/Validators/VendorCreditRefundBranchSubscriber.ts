import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { IRefundVendorCreditCreatingPayload } from '@/interfaces';
import { ValidateBranchExistance } from '../../Integrations/ValidateBranchExistance';

@Service()
export class VendorCreditRefundBranchValidateSubscriber {
  @Inject()
  private validateBranchExistance: ValidateBranchExistance;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.vendorCredit.onRefundCreating,
      this.validateBranchExistanceOnCreditRefundCreating
    );
    return bus;
  };

  /**
   * Validate branch existance on refund credit note creating.
   * @param {IRefundVendorCreditCreatingPayload} payload
   */
  private validateBranchExistanceOnCreditRefundCreating = async ({
    tenantId,
    refundVendorCreditDTO,
  }: IRefundVendorCreditCreatingPayload) => {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      tenantId,
      refundVendorCreditDTO.branchId
    );
  };
}
