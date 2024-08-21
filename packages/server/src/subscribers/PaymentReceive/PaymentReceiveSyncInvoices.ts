import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { PaymentReceivedInvoiceSync } from '@/services/Sales/PaymentReceived/PaymentReceivedInvoiceSync';
import {
  IPaymentReceivedCreatedPayload,
  IPaymentReceivedDeletedPayload,
  IPaymentReceivedEditedPayload,
} from '@/interfaces';

@Service()
export default class PaymentReceiveSyncInvoicesSubscriber {
  @Inject()
  private paymentSyncInvoice: PaymentReceivedInvoiceSync;

  /**
   * Attaches the events to handles.
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(
      events.paymentReceive.onCreated,
      this.handleInvoiceIncrementPaymentOnceCreated
    );
    bus.subscribe(
      events.paymentReceive.onEdited,
      this.handleInvoiceIncrementPaymentOnceEdited
    );
    bus.subscribe(
      events.paymentReceive.onDeleted,
      this.handleInvoiceDecrementPaymentAmount
    );
  }

  /**
   * Handle sale invoice increment/decrement payment amount
   * once created, edited or deleted.
   */
  private handleInvoiceIncrementPaymentOnceCreated = async ({
    tenantId,
    paymentReceive,
    trx,
  }: IPaymentReceivedCreatedPayload) => {
    await this.paymentSyncInvoice.saveChangeInvoicePaymentAmount(
      tenantId,
      paymentReceive.entries,
      null,
      trx
    );
  };

  /**
   * Handle sale invoice increment/decrement payment amount once edited.
   */
  private handleInvoiceIncrementPaymentOnceEdited = async ({
    tenantId,
    paymentReceiveId,
    paymentReceive,
    oldPaymentReceive,
    trx,
  }: IPaymentReceivedEditedPayload) => {
    await this.paymentSyncInvoice.saveChangeInvoicePaymentAmount(
      tenantId,
      paymentReceive.entries,
      oldPaymentReceive?.entries || null,
      trx
    );
  };

  /**
   * Handle revert invoices payment amount once payment receive deleted.
   */
  private handleInvoiceDecrementPaymentAmount = async ({
    tenantId,
    paymentReceiveId,
    oldPaymentReceive,
    trx,
  }: IPaymentReceivedDeletedPayload) => {
    await this.paymentSyncInvoice.saveChangeInvoicePaymentAmount(
      tenantId,
      oldPaymentReceive.entries.map((entry) => ({
        ...entry,
        paymentAmount: 0,
      })),
      oldPaymentReceive.entries,
      trx
    );
  };
}
