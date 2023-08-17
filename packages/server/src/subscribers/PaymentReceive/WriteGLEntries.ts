import { Inject, Service } from 'typedi';
import {
  IPaymentReceiveCreatedPayload,
  IPaymentReceiveDeletedPayload,
  IPaymentReceiveEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { PaymentReceiveGLEntries } from '@/services/Sales/PaymentReceives/PaymentReceiveGLEntries';

@Service()
export default class PaymentReceivesWriteGLEntriesSubscriber {
  @Inject()
  private paymentReceiveGLEntries: PaymentReceiveGLEntries;

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
  }: IPaymentReceiveCreatedPayload) => {
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
  }: IPaymentReceiveEditedPayload) => {
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
  }: IPaymentReceiveDeletedPayload) => {
    await this.paymentReceiveGLEntries.revertPaymentGLEntries(
      tenantId,
      paymentReceiveId,
      trx
    );
  };
}
