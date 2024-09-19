import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { CreatePaymentReceiveStripePayment } from '../CreatePaymentReceivedStripePayment';
import { StripeCheckoutSessionCompletedEventPayload } from '@/interfaces/StripePayment';

@Service()
export class StripeWebhooksSubscriber {
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

    // Get the amount from the event
    const amount = event.data.object.amount_total;

    // Convert from Stripe amount (cents) to normal amount (dollars)
    const amountInDollars = amount / 100;

    await this.createPaymentReceiveStripePayment.createPaymentReceived(
      tenantId,
      saleInvoiceId,
      amountInDollars
    );
  }
}
