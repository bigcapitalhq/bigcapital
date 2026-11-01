import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import {
  IRefundVendorCreditCreatedPayload,
  IRefundVendorCreditDeletedPayload,
} from '../types/VendorCreditRefund.types';
import { RefundSyncCreditRefundedAmount } from '../commands/RefundSyncCreditRefundedAmount.service';

@Injectable()
export class RefundSyncVendorCreditBalanceSubscriber {
  constructor(
    private readonly refundSyncCreditRefunded: RefundSyncCreditRefundedAmount,
  ) {}

  /**
   * Increments the refunded amount of the vendor credit once the refund
   * transaction is created.
   * @param {IRefundVendorCreditCreatedPayload} payload -
   */
  @OnEvent(events.vendorCredit.onRefundCreated)
  async incrementRefundedAmountOnceRefundCreated({
    refundVendorCredit,
    trx,
  }: IRefundVendorCreditCreatedPayload) {
    await this.refundSyncCreditRefunded.incrementCreditRefundedAmount(
      refundVendorCredit.vendorCreditId,
      refundVendorCredit.amount,
      trx,
    );
  }

  /**
   * Decrements the refunded amount of the vendor credit once the refund
   * transaction is deleted.
   * @param {IRefundVendorCreditDeletedPayload} payload -
   */
  @OnEvent(events.vendorCredit.onRefundDeleted)
  async decrementRefundedAmountOnceRefundDeleted({
    oldRefundCredit,
    trx,
  }: IRefundVendorCreditDeletedPayload) {
    await this.refundSyncCreditRefunded.decrementCreditNoteRefundAmount(
      oldRefundCredit.vendorCreditId,
      oldRefundCredit.amount,
      trx,
    );
  }
}
