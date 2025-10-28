import { events } from '@/common/events/events';
import { RefundCreditNoteGLEntries } from '@/modules/CreditNoteRefunds/commands/RefundCreditNoteGLEntries';
import {
  IRefundCreditNoteCreatedPayload,
  IRefundCreditNoteDeletedPayload,
} from '@/modules/CreditNoteRefunds/types/CreditNoteRefunds.types';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class RefundCreditNoteGLEntriesSubscriber {
  constructor(
    private readonly refundCreditGLEntries: RefundCreditNoteGLEntries,
  ) {}

  /**
   * Writes refund credit note GL entries once the transaction created.
   * @param {IRefundCreditNoteCreatedPayload} payload -
   */
  @OnEvent(events.creditNote.onRefundCreated)
  async writeRefundCreditGLEntriesOnceCreated({
    trx,
    refundCreditNote,
    creditNote,
  }: IRefundCreditNoteCreatedPayload) {
    await this.refundCreditGLEntries.createRefundCreditGLEntries(
      refundCreditNote.id,
      trx,
    );
  }

  /**
   * Reverts refund credit note GL entries once the transaction deleted.
   * @param {IRefundCreditNoteDeletedPayload} payload -
   */
  @OnEvent(events.creditNote.onRefundDeleted)
  async revertRefundCreditGLEntriesOnceDeleted({
    trx,
    refundCreditId,
    oldRefundCredit,
  }: IRefundCreditNoteDeletedPayload) {
    await this.refundCreditGLEntries.revertRefundCreditGLEntries(
      refundCreditId,
      trx,
    );
  }
}
