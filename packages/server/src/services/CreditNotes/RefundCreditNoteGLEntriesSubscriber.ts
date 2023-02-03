import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import RefundCreditNoteGLEntries from './RefundCreditNoteGLEntries';
import {
  IRefundCreditNoteCreatedPayload,
  IRefundCreditNoteDeletedPayload,
} from '@/interfaces';

@Service()
export default class RefundCreditNoteGLEntriesSubscriber {
  @Inject()
  refundCreditGLEntries: RefundCreditNoteGLEntries;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.creditNote.onRefundCreated,
      this.writeRefundCreditGLEntriesOnceCreated
    );
    bus.subscribe(
      events.creditNote.onRefundDeleted,
      this.revertRefundCreditGLEntriesOnceDeleted
    );
  };

  /**
   * Writes refund credit note GL entries once the transaction created.
   * @param {IRefundCreditNoteCreatedPayload} payload -
   */
  private writeRefundCreditGLEntriesOnceCreated = async ({
    trx,
    refundCreditNote,
    creditNote,
    tenantId,
  }: IRefundCreditNoteCreatedPayload) => {
    await this.refundCreditGLEntries.createRefundCreditGLEntries(
      tenantId,
      refundCreditNote.id,
      trx
    );
  };

  /**
   * Reverts refund credit note GL entries once the transaction deleted.
   * @param {IRefundCreditNoteDeletedPayload} payload -
   */
  private revertRefundCreditGLEntriesOnceDeleted = async ({
    trx,
    refundCreditId,
    oldRefundCredit,
    tenantId,
  }: IRefundCreditNoteDeletedPayload) => {
    await this.refundCreditGLEntries.revertRefundCreditGLEntries(
      tenantId,
      refundCreditId,
      trx
    );
  };
}
