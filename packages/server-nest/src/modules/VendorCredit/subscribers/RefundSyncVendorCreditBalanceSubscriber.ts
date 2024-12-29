import { Service, Inject } from 'typedi';
import {
  IRefundVendorCreditCreatedPayload,
  IRefundVendorCreditDeletedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import RefundSyncCreditRefundedAmount from './RefundSyncCreditRefundedAmount';

@Service()
export default class RefundSyncVendorCreditBalanceSubscriber {
  @Inject()
  refundSyncCreditRefunded: RefundSyncCreditRefundedAmount;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.vendorCredit.onRefundCreated,
      this.incrementRefundedAmountOnceRefundCreated
    );
    bus.subscribe(
      events.vendorCredit.onRefundDeleted,
      this.decrementRefundedAmountOnceRefundDeleted
    );
  };

  /**
   * Increment refunded vendor credit amount once refund transaction created.
   * @param {IRefundVendorCreditCreatedPayload} payload -
   */
  private incrementRefundedAmountOnceRefundCreated = async ({
    refundVendorCredit,
    vendorCredit,
    tenantId,
    trx,
  }: IRefundVendorCreditCreatedPayload) => {
    await this.refundSyncCreditRefunded.incrementCreditRefundedAmount(
      tenantId,
      refundVendorCredit.vendorCreditId,
      refundVendorCredit.amount,
      trx
    );
  };

  /**
   * Decrement refunded vendor credit amount once refund transaction deleted.
   * @param {IRefundVendorCreditDeletedPayload} payload -
   */
  private decrementRefundedAmountOnceRefundDeleted = async ({
    trx,
    oldRefundCredit,
    tenantId,
  }: IRefundVendorCreditDeletedPayload) => {
    await this.refundSyncCreditRefunded.decrementCreditNoteRefundAmount(
      tenantId,
      oldRefundCredit.vendorCreditId,
      oldRefundCredit.amount,
      trx
    );
  };
}
