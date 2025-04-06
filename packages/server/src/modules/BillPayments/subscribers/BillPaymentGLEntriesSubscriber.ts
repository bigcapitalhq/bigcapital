import {
  IBillPaymentEventCreatedPayload,
  IBillPaymentEventDeletedPayload,
  IBillPaymentEventEditedPayload,
} from '../types/BillPayments.types';
import { BillPaymentGLEntries } from '../commands/BillPaymentGLEntries';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class BillPaymentGLEntriesSubscriber {
  constructor(
    private readonly billPaymentGLEntries: BillPaymentGLEntries,
  ) {}

  /**
   * Handle bill payment writing journal entries once created.
   */
  @OnEvent(events.billPayment.onCreated)
  private async handleWriteJournalEntries({
    billPayment,
    trx,
  }: IBillPaymentEventCreatedPayload) {
    // Records the journal transactions after bills payment
    // and change diff account balance.
    await this.billPaymentGLEntries.writePaymentGLEntries(
      billPayment.id,
      trx
    );
  };

  /**
   * Handle bill payment re-writing journal entries once the payment transaction be edited.
   */
  @OnEvent(events.billPayment.onEdited)
  private async handleRewriteJournalEntriesOncePaymentEdited({
    billPayment,
    trx,
  }: IBillPaymentEventEditedPayload) {
    await this.billPaymentGLEntries.rewritePaymentGLEntries(
      billPayment.id,
      trx
    );
  };

  /**
   * Reverts journal entries once bill payment deleted.
   */
  @OnEvent(events.billPayment.onDeleted)
  private async handleRevertJournalEntries({
    billPaymentId,
    trx,
  }: IBillPaymentEventDeletedPayload) {
    await this.billPaymentGLEntries.revertPaymentGLEntries(
      billPaymentId,
      trx
    );
  };
}
