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
      events.billPayment.onPrepardExpensesApplied,
      this.handleWritePrepardExpenseGLEntries
    );
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
   * Handles bill payment writing journal entries once created.
   * @param {IBillPaymentEventCreatedPayload} payload -
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
   * Handles rewrite prepard expense GL entries once the bill payment applying to bills.
   * @param {IBillPaymentEventCreatedPayload} payload -
   */
  private handleWritePrepardExpenseGLEntries = async ({
    tenantId,
    billPaymentId,
    trx,
  }: IBillPaymentEventCreatedPayload) => {
    await this.billPaymentGLEntries.rewritePaymentGLEntries(
      tenantId,
      billPaymentId,
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
