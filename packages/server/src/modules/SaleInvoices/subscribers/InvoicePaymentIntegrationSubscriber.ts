import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PaymentIntegrationTransactionLinkDeleteEventPayload } from '../SaleInvoice.types';
import { PaymentIntegrationTransactionLinkEventPayload } from '../SaleInvoice.types';
import { PaymentIntegrationTransactionLink } from '../SaleInvoice.types';
import { omit } from 'lodash';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceDeletingPayload,
} from '../SaleInvoice.types';
import { events } from '@/common/events/events';
import { TransactionPaymentServiceEntry } from '@/modules/PaymentServices/models/TransactionPaymentServiceEntry.model';

@Injectable()
export class InvoicePaymentIntegrationSubscriber {
  constructor(private readonly eventPublisher: EventEmitter2) {}

  /**
   * Handles the creation of payment integration events when a sale invoice is created.
   * This method filters enabled payment methods from the invoice and emits a payment
   * integration link event for each method.
   * @param {ISaleInvoiceCreatedPayload} payload - The payload containing sale invoice creation details.
   */
  @OnEvent(events.saleInvoice.onCreated)
  public handleCreatePaymentIntegrationEvents({
    saleInvoiceDTO,
    saleInvoice,
    trx,
  }: ISaleInvoiceCreatedPayload) {
    const paymentMethods =
      saleInvoice.paymentMethods?.filter((method) => method.enable) || [];

    paymentMethods.map(
      async (paymentMethod: TransactionPaymentServiceEntry) => {
        const payload = {
          ...omit(paymentMethod, ['id']),
          saleInvoiceId: saleInvoice.id,
          trx,
        };
        await this.eventPublisher.emitAsync(
          events.paymentIntegrationLink.onPaymentIntegrationLink,
          payload as PaymentIntegrationTransactionLinkEventPayload,
        );
      },
    );
  }

  /**
   *
   * @param {ISaleInvoiceDeletingPayload} payload
   */
  @OnEvent(events.saleInvoice.onDeleting)
  public handleCreatePaymentIntegrationEventsOnDeleteInvoice({
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceDeletingPayload) {
    const paymentMethods =
      oldSaleInvoice.paymentMethods?.filter((method) => method.enable) || [];

    paymentMethods.map(
      async (paymentMethod: TransactionPaymentServiceEntry) => {
        const payload = {
          ...omit(paymentMethod, ['id']),
          oldSaleInvoiceId: oldSaleInvoice.id,
          trx,
        } as PaymentIntegrationTransactionLinkDeleteEventPayload;

        // Triggers `onPaymentIntegrationDeleteLink` event.
        await this.eventPublisher.emitAsync(
          events.paymentIntegrationLink.onPaymentIntegrationDeleteLink,
          payload,
        );
      },
    );
  }
}
