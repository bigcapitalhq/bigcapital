import { events } from '@/common/events/events';
import { RefundSyncCreditNoteBalanceService } from '@/modules/CreditNoteRefunds/commands/RefundSyncCreditNoteBalance';
import {
  IRefundCreditNoteCreatedPayload,
  IRefundCreditNoteDeletedPayload,
} from '@/modules/CreditNoteRefunds/types/CreditNoteRefunds.types';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class RefundSyncCreditNoteBalanceSubscriber {
  constructor(
    private readonly refundSyncCreditBalance: RefundSyncCreditNoteBalanceService,
  ) {}

  /**
   * Increment credit note refunded amount once associated refund transaction created.
   * @param {IRefundCreditNoteCreatedPayload} payload -
   */
  @OnEvent(events.creditNote.onRefundCreated)
  async incrementRefundedAmountOnceRefundCreated({
    trx,
    refundCreditNote,
  }: IRefundCreditNoteCreatedPayload) {
    await this.refundSyncCreditBalance.incrementCreditNoteRefundAmount(
      refundCreditNote.creditNoteId,
      refundCreditNote.amount,
      trx,
    );
  }

  /**
   * Decrement credit note refunded amount once associated refuned transaction deleted.
   * @param {IRefundCreditNoteDeletedPayload} payload -
   */
  @OnEvent(events.creditNote.onRefundDeleted)
  async decrementRefundedAmountOnceRefundDeleted({
    trx,
    oldRefundCredit,
  }: IRefundCreditNoteDeletedPayload) {
    await this.refundSyncCreditBalance.decrementCreditNoteRefundAmount(
      oldRefundCredit.creditNoteId,
      oldRefundCredit.amount,
      trx,
    );
  }
}
