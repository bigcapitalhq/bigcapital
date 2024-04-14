import { getPrice } from '@lemonsqueezy/lemonsqueezy.js';
import { ServiceError } from '@/exceptions';
import { Service } from 'typedi';
import {
  compareSignatures,
  configureLemonSqueezy,
  createHmacSignature,
  webhookHasData,
  webhookHasMeta,
} from './utils';
import { Plan } from '@/system/models';

@Service()
export class LemonWebhooks {
  /**
   *
   * @param {string} rawBody
   * @param {string} signature
   * @returns
   */
  public async handlePostWebhook(
    rawData: any,
    data: Record<string, any>,
    signature: string
  ) {
    configureLemonSqueezy();

    if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
      return new ServiceError('Lemon Squeezy Webhook Secret not set in .env');
    }
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const hmacSignature = createHmacSignature(secret, rawData);

    if (!compareSignatures(hmacSignature, signature)) {
      console.log('invalid');
      return new Error('Invalid signature', { status: 400 });
    }
    // Type guard to check if the object has a 'meta' property.
    if (webhookHasMeta(data)) {
      // Non-blocking call to process the webhook event.
      void this.processWebhookEvent(data);

      return true;
    }
    return new Error('Data invalid', { status: 400 });
  }

  /**
   * This action will process a webhook event in the database.
   */
  async processWebhookEvent(eventBody) {
    let processingError = '';
    const webhookEvent = eventBody.meta.event_name;

    if (!webhookHasMeta(eventBody)) {
      processingError = "Event body is missing the 'meta' property.";
    } else if (webhookHasData(eventBody)) {
      if (webhookEvent.startsWith('subscription_payment_')) {
        // Save subscription invoices; eventBody is a SubscriptionInvoice
        // Not implemented.
      } else if (webhookEvent.startsWith('subscription_')) {
        // Save subscription events; obj is a Subscription
        const attributes = eventBody.data.attributes;
        const variantId = attributes.variant_id as string;

        // We assume that the Plan table is up to date.
        const plan = await Plan.query().findOne('slug', 'essentials-yearly');

        if (!plan) {
          processingError = `Plan with variantId ${variantId} not found.`;
        } else {
          // Update the subscription in the database.
          const priceId = attributes.first_subscription_item.price_id;

          // Get the price data from Lemon Squeezy.
          const priceData = await getPrice(priceId);

          if (priceData.error) {
            processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.`;
          }

          const isUsageBased =
            attributes.first_subscription_item.is_usage_based;
          const price = isUsageBased
            ? priceData.data?.data.attributes.unit_price_decimal
            : priceData.data?.data.attributes.unit_price;

          const newSubscription = {};
        }
      } else if (webhookEvent.startsWith('order_')) {
        // Save orders; eventBody is a "Order"
        /* Not implemented */
      } else if (webhookEvent.startsWith('license_')) {
        // Save license keys; eventBody is a "License key"
        /* Not implemented */
      }
    }
  }
}
