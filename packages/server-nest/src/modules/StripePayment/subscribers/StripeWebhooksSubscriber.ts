import { CreatePaymentReceiveStripePayment } from '../CreatePaymentReceivedStripePayment';
import {
  StripeCheckoutSessionCompletedEventPayload,
  StripeWebhookEventPayload,
} from '../StripePayment.types';
// import { initalizeTenantServices } from '@/api/middleware/TenantDependencyInjection';
// import { initializeTenantSettings } from '@/api/middleware/SettingsMiddleware';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { PaymentIntegration } from '../models/PaymentIntegration.model';

@Injectable()
export class StripeWebhooksSubscriber {
  constructor(
    private readonly createPaymentReceiveStripePayment: CreatePaymentReceiveStripePayment,

    @Inject(PaymentIntegration.name)
    private readonly paymentIntegrationModel: typeof PaymentIntegration,
  ) {}

  /**
   * Handles the checkout session completed webhook event.
   * @param {StripeCheckoutSessionCompletedEventPayload} payload -
   */
  @OnEvent(events.stripeWebhooks.onCheckoutSessionCompleted)
  async handleCheckoutSessionCompleted({
    event,
  }: StripeCheckoutSessionCompletedEventPayload) {
    const { metadata } = event.data.object;
    const tenantId = parseInt(metadata.tenantId, 10);
    const saleInvoiceId = parseInt(metadata.saleInvoiceId, 10);

    // await initalizeTenantServices(tenantId);
    // await initializeTenantSettings(tenantId);

    // Get the amount from the event
    const amount = event.data.object.amount_total;

    // Convert from Stripe amount (cents) to normal amount (dollars)
    const amountInDollars = amount / 100;

    // Creates a new payment received transaction.
    await this.createPaymentReceiveStripePayment.createPaymentReceived(
      saleInvoiceId,
      amountInDollars,
    );
  }

  /**
   * Handles the account updated.
   * @param {StripeWebhookEventPayload}
   */
  @OnEvent(events.stripeWebhooks.onAccountUpdated)
  async handleAccountUpdated({ event }: StripeWebhookEventPayload) {
    const { metadata } = event.data.object;
    const account = event.data.object;
    const tenantId = parseInt(metadata.tenantId, 10);

    if (!metadata?.paymentIntegrationId || !metadata.tenantId) return;

    // Find the tenant or throw not found error.
    // await Tenant.query().findById(tenantId).throwIfNotFound();

    // Check if the account capabilities are active
    if (account.capabilities.card_payments === 'active') {
      // Marks the payment method integration as active.
      await this.paymentIntegrationModel
        .query()
        .findById(metadata?.paymentIntegrationId)
        .patch({
          active: true,
        });
    }
  }
}
