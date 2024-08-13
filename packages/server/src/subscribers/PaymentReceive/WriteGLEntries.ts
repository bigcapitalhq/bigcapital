import { Inject, Service } from 'typedi';
import {
  IPaymentReceivedCreatedPayload,
  IPaymentReceivedDeletedPayload,
  IPaymentReceivedEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { PaymentReceivedGLEntries } from '@/services/Sales/PaymentReceived/PaymentReceivedGLEntries';

@Service()
export default class PaymentReceivesWriteGLEntriesSubscriber {
  @Inject()
  private paymentReceiveGLEntries: PaymentReceivedGLEntries;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.paymentReceive.onCreated,
      this.handleWriteJournalEntriesOnceCreated
    );
    bus.subscribe(
      events.paymentReceive.onEdited,
      this.handleOverwriteJournalEntriesOnceEdited
    );
    bus.subscribe(
      events.paymentReceive.onDeleted,
      this.handleRevertJournalEntriesOnceDeleted
    );
  }

  /**
   * Handle journal entries writing once the payment receive created.
   */
  private handleWriteJournalEntriesOnceCreated = async ({
    tenantId,
    paymentReceiveId,
    trx,
  }: IPaymentReceivedCreatedPayload) => {
    await this.paymentReceiveGLEntries.writePaymentGLEntries(
      tenantId,
      paymentReceiveId,
      trx
    );
  };

  /**
   * Handle journal entries writing once the payment receive edited.
   */
  private handleOverwriteJournalEntriesOnceEdited = async ({
    tenantId,
    paymentReceive,
    trx,
  }: IPaymentReceivedEditedPayload) => {
    await this.paymentReceiveGLEntries.rewritePaymentGLEntries(
      tenantId,
      paymentReceive.id,
      trx
    );
  };

  /**
   * Handles revert journal entries once deleted.
   */
  private handleRevertJournalEntriesOnceDeleted = async ({
    tenantId,
    paymentReceiveId,
    trx,
  }: IPaymentReceivedDeletedPayload) => {
    await this.paymentReceiveGLEntries.revertPaymentGLEntries(
      tenantId,
      paymentReceiveId,
      trx
    );
  };
}
