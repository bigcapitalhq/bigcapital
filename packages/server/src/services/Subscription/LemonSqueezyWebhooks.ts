import config from '@/config';
import { Inject, Service } from 'typedi';
import {
  compareSignatures,
  configureLemonSqueezy,
  createHmacSignature,
  webhookHasData,
  webhookHasMeta,
} from './utils';
import { Plan } from '@/system/models';
import { Subscription } from './Subscription';

@Service()
export class LemonSqueezyWebhooks {
  @Inject()
  private subscriptionService: Subscription;

  /**
   * Handles the Lemon Squeezy webhooks.
   * @param {string} rawBody
   * @param {string} signature
   * @returns {Promise<void>}
   */
  public async handlePostWebhook(
    rawData: any,
    data: Record<string, any>,
    signature: string
  ): Promise<void> {
    configureLemonSqueezy();

    if (!config.lemonSqueezy.webhookSecret) {
      throw new Error('Lemon Squeezy Webhook Secret not set in .env');
    }
    if (!signature) {
      throw new Error('Request signature is required.');
    }
    const secret = config.lemonSqueezy.webhookSecret;
    const hmacSignature = createHmacSignature(secret, rawData);

    if (!compareSignatures(hmacSignature, signature)) {
      throw new Error('Invalid signature');
    }
    // Type guard to check if the object has a 'meta' property.
    if (webhookHasMeta(data)) {
      // Non-blocking call to process the webhook event.
      void this.processWebhookEvent(data);
    } else {
      throw new Error('Data invalid');
    }
  }

  /**
   * This action will process a webhook event in the database.
   * @param {unknown} eventBody -
   * @returns {Promise<void>}
   */
  private async processWebhookEvent(eventBody): Promise<void> {
    const webhookEvent = eventBody.meta.event_name;

    const userId = eventBody.meta.custom_data?.user_id;
    const tenantId = eventBody.meta.custom_data?.tenant_id;
    const subscriptionSlug = 'main';

    if (!webhookHasMeta(eventBody)) {
      throw new Error("Event body is missing the 'meta' property.");
    } else if (webhookHasData(eventBody)) {
      if (webhookEvent.startsWith('subscription_payment_')) {
        // Marks the main subscription payment as succeed.
        if (webhookEvent === 'subscription_payment_success') {
          await this.subscriptionService.markSubscriptionPaymentSucceed(
            tenantId,
            subscriptionSlug
          );
          // Marks the main subscription payment as failed.
        } else if (webhookEvent === 'subscription_payment_failed') {
          await this.subscriptionService.markSubscriptionPaymentFailed(
            tenantId,
            subscriptionSlug
          );
        }
        // Save subscription invoices; eventBody is a SubscriptionInvoice
        // Not implemented.
      } else if (webhookEvent.startsWith('subscription_')) {
        // Save subscription events; obj is a Subscription
        const attributes = eventBody.data.attributes;
        const variantId = attributes.variant_id as string;

        // We assume that the Plan table is up to date.
        const plan = await Plan.query().findOne('lemonVariantId', variantId);

        // Update the subscription in the database.
        const priceId = attributes.first_subscription_item.price_id;
        const subscriptionId = eventBody.data.id;

        // Throw error early if the given lemon variant id is not associated to any plan.
        if (!plan) {
          throw new Error(`Plan with variantId ${variantId} not found.`);
        }
        // Create a new subscription of the tenant.
        if (webhookEvent === 'subscription_created') {
          await this.subscriptionService.newSubscribtion(
            tenantId,
            plan.slug,
            subscriptionSlug,
            { lemonSqueezyId: subscriptionId }
          );
          // Cancel the given subscription of the organization.
        } else if (webhookEvent === 'subscription_cancelled') {
          await this.subscriptionService.cancelSubscription(
            tenantId,
            subscriptionSlug
          );
        } else if (webhookEvent === 'subscription_plan_changed') {
          await this.subscriptionService.subscriptionPlanChanged(
            tenantId,
            plan.slug,
            subscriptionSlug
          );
        } else if (webhookEvent === 'subscription_resumed') {
          await this.subscriptionService.resumeSubscription(
            tenantId,
            subscriptionSlug
          );
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
