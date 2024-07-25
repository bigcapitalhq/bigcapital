import { Inject, Service } from 'typedi';
import {
  IPaymentReceiveCreatedPayload,
  IPaymentReceiveDeletedPayload,
  IPaymentReceiveEditedPayload,
  PaymentReceiveUnearnedRevenueAppliedEventPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { PaymentReceiveGLEntries } from '@/services/Sales/PaymentReceives/PaymentReceiveGLEntries';
import { PaymentReceivedUnearnedGLEntries } from '@/services/Sales/PaymentReceives/PaymentReceivedUnearnedGLEntries';

@Service()
export default class PaymentReceivesWriteGLEntriesSubscriber {
  @Inject()
  private paymentReceiveGLEntries: PaymentReceiveGLEntries;

  @Inject()
  private paymentReceivedUnearnedGLEntries: PaymentReceivedUnearnedGLEntries;

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
   * @param {IPaymentReceiveCreatedPayload} payload -
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
    await this.paymentReceivedUnearnedGLEntries.writePaymentGLEntries(
      tenantId,
      paymentReceiveId,
      trx
    );
  };

  /**
   * Handle journal entries writing once the payment receive edited.
   * @param {IPaymentReceiveEditedPayload} payload -
   */
  private handleOverwriteJournalEntriesOnceEdited = async ({
    tenantId,
    paymentReceive,
    paymentReceiveId,
    trx,
  }: IPaymentReceiveEditedPayload) => {
    await this.paymentReceiveGLEntries.rewritePaymentGLEntries(
      tenantId,
      paymentReceive.id,
      trx
    );
    await this.paymentReceivedUnearnedGLEntries.rewritePaymentGLEntries(
      tenantId,
      paymentReceiveId,
      trx
    );
  };

  /**
   * Handles revert journal entries once deleted.
   * @param {IPaymentReceiveDeletedPayload} payload -
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
