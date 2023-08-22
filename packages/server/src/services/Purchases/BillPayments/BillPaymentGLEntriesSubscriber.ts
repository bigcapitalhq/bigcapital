import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IBillPaymentEventCreatedPayload,
  IBillPaymentEventDeletedPayload,
  IBillPaymentEventEditedPayload,
} from '@/interfaces';
import { BillPaymentGLEntries } from './BillPaymentGLEntries';

@Service()
export class PaymentWriteGLEntriesSubscriber {
  @Inject()
  private billPaymentGLEntries: BillPaymentGLEntries;

  /**
   * Attaches events with handles.
   */
  public attach(bus) {
    bus.subscribe(events.billPayment.onCreated, this.handleWriteJournalEntries);
    bus.subscribe(
      events.billPayment.onEdited,
      this.handleRewriteJournalEntriesOncePaymentEdited
    );
    bus.subscribe(
      events.billPayment.onDeleted,
      this.handleRevertJournalEntries
    );
  }

  /**
   * Handle bill payment writing journal entries once created.
   */
  private handleWriteJournalEntries = async ({
    tenantId,
    billPayment,
    trx,
  }: IBillPaymentEventCreatedPayload) => {
    // Records the journal transactions after bills payment
    // and change diff account balance.
    await this.billPaymentGLEntries.writePaymentGLEntries(
      tenantId,
      billPayment.id,
      trx
    );
  };

  /**
   * Handle bill payment re-writing journal entries once the payment transaction be edited.
   */
  private handleRewriteJournalEntriesOncePaymentEdited = async ({
    tenantId,
    billPayment,
    trx,
  }: IBillPaymentEventEditedPayload) => {
    await this.billPaymentGLEntries.rewritePaymentGLEntries(
      tenantId,
      billPayment.id,
      trx
    );
  };

  /**
   * Reverts journal entries once bill payment deleted.
   */
  private handleRevertJournalEntries = async ({
    tenantId,
    billPaymentId,
    trx,
  }: IBillPaymentEventDeletedPayload) => {
    await this.billPaymentGLEntries.revertPaymentGLEntries(
      tenantId,
      billPaymentId,
      trx
    );
  };
}
