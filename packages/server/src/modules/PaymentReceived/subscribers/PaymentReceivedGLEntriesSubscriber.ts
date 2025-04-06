import { Injectable } from '@nestjs/common';
import {
  IPaymentReceivedCreatedPayload,
  IPaymentReceivedDeletedPayload,
  IPaymentReceivedEditedPayload,
} from '../types/PaymentReceived.types';
import { PaymentReceivedGLEntries } from '../commands/PaymentReceivedGLEntries';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class PaymentReceivedGLEntriesSubscriber {
  /**
   * @param {PaymentReceivedGLEntries} paymentReceivedGLEntries - 
   */
  constructor(
    private readonly paymentReceivedGLEntries: PaymentReceivedGLEntries,
  ) {}

  /**
   * Handle journal entries writing once the payment receive created.
   */
  @OnEvent(events.paymentReceive.onCreated)
  private async handleWriteJournalEntriesOnceCreated({
    paymentReceiveId,
    trx,
  }: IPaymentReceivedCreatedPayload) {
    await this.paymentReceivedGLEntries.writePaymentGLEntries(
      paymentReceiveId,
      trx,
    );
  }

  /**
   * Handle journal entries writing once the payment receive edited.
   */
  @OnEvent(events.paymentReceive.onEdited)
  private async handleOverwriteJournalEntriesOnceEdited({
    paymentReceive,
    trx,
  }: IPaymentReceivedEditedPayload) {
    await this.paymentReceivedGLEntries.rewritePaymentGLEntries(
      paymentReceive.id,
      trx,
    );
  }

  /**
   * Handles revert journal entries once deleted.
   */
  @OnEvent(events.paymentReceive.onDeleted)
  private async handleRevertJournalEntriesOnceDeleted({
    paymentReceiveId,
    trx,
  }: IPaymentReceivedDeletedPayload) {
    await this.paymentReceivedGLEntries.revertPaymentGLEntries(
      paymentReceiveId,
      trx,
    );
  }
}
