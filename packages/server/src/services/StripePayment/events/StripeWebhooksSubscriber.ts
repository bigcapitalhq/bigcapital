import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { CreatePaymentReceiveStripePayment } from '../CreatePaymentReceivedStripePayment';
import {
  StripeCheckoutSessionCompletedEventPayload,
  StripeWebhookEventPayload,
} from '@/interfaces/StripePayment';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Tenant } from '@/system/models';
import { initalizeTenantServices } from '@/api/middleware/TenantDependencyInjection';
import { initializeTenantSettings } from '@/api/middleware/SettingsMiddleware';

@Service()
export class StripeWebhooksSubscriber {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private createPaymentReceiveStripePayment: CreatePaymentReceiveStripePayment;

  /**
   * Attaches the subscriber to the event dispatcher.
   */
  public attach(bus) {
    bus.subscribe(
      events.stripeWebhooks.onCheckoutSessionCompleted,
      this.handleCheckoutSessionCompleted.bind(this)
    );
    bus.subscribe(
      events.stripeWebhooks.onAccountUpdated,
      this.handleAccountUpdated.bind(this)
    );
  }

  /**
   * Handles the checkout session completed webhook event.
   * @param {StripeCheckoutSessionCompletedEventPayload} payload -
   */
  async handleCheckoutSessionCompleted({
    event,
  }: StripeCheckoutSessionCompletedEventPayload) {
    const { metadata } = event.data.object;
    const tenantId = parseInt(metadata.tenantId, 10);
    const saleInvoiceId = parseInt(metadata.saleInvoiceId, 10);

    await initalizeTenantServices(tenantId);
    await initializeTenantSettings(tenantId);

    // Get the amount from the event
    const amount = event.data.object.amount_total;

    // Convert from Stripe amount (cents) to normal amount (dollars)
    const amountInDollars = amount / 100;

    // Creates a new payment received transaction.
    await this.createPaymentReceiveStripePayment.createPaymentReceived(
      tenantId,
      saleInvoiceId,
      amountInDollars
    );
  }

  /**
   * Handles the account updated.
   * @param {StripeWebhookEventPayload}
   */
  async handleAccountUpdated({ event }: StripeWebhookEventPayload) {
    const { metadata } = event.data.object;
    const account = event.data.object;
    const tenantId = parseInt(metadata.tenantId, 10);

    if (!metadata?.paymentIntegrationId || !metadata.tenantId) return;

    // Find the tenant or throw not found error.
    await Tenant.query().findById(tenantId).throwIfNotFound();

    // Check if the account capabilities are active
    if (account.capabilities.card_payments === 'active') {
      const { PaymentIntegration } = this.tenancy.models(tenantId);

      // Marks the payment method integration as active.
      await PaymentIntegration.query()
        .findById(metadata?.paymentIntegrationId)
        .patch({
          active: true,
        });
    }
  }
}
