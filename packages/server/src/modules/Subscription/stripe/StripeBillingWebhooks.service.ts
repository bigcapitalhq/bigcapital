import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type Stripe from 'stripe';
import { events } from '@/common/events/events';
import { SubscriptionPaymentStatus } from '@/interfaces/SubscriptionPlan';
import { PlanSubscription } from '../models/PlanSubscription';
import { StripeWebhookEvent } from '../models/StripeWebhookEvent';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { StripeBillingService } from './StripeBillingService';
import { SyncStripeSubscriptionService } from './SyncStripeSubscription.service';

@Injectable()
export class StripeBillingWebhooksService {
  private readonly logger = new Logger(StripeBillingWebhooksService.name);

  constructor(
    private readonly stripeBilling: StripeBillingService,
    private readonly syncService: SyncStripeSubscriptionService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,

    @Inject(StripeWebhookEvent.name)
    private readonly webhookEventModel: typeof StripeWebhookEvent,
  ) {}

  /**
   * Verifies, records, and processes a Stripe Billing webhook event.
   */
  public async handle(
    rawBody: Buffer | string,
    signature: string,
  ): Promise<void> {
    this.stripeBilling.assertBillingAvailable();

    const webhookSecret = this.configService.get<string>(
      'stripeBilling.webhookSecret',
    );
    if (!webhookSecret) {
      throw new BadRequestException(
        'Stripe billing webhook secret is not configured.',
      );
    }
    if (!signature) {
      throw new BadRequestException('Stripe signature header is missing.');
    }

    let event: Stripe.Event;
    try {
      event = this.stripeBilling.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (error) {
      throw new BadRequestException(
        `Webhook Error: ${(error as Error).message}`,
      );
    }

    const existing = await this.webhookEventModel
      .query()
      .findOne({ stripeEventId: event.id });

    if (existing?.processedAt) {
      return;
    }

    let record = existing;
    if (!record) {
      try {
        record = await this.webhookEventModel.query().insert({
          stripeEventId: event.id,
          type: event.type,
          payload: JSON.stringify(event),
        });
      } catch {
        // Another concurrent delivery of the same event won the insert race.
        record = await this.webhookEventModel
          .query()
          .findOne({ stripeEventId: event.id });
      }
    }
    if (!record) {
      throw new Error(`Unable to record Stripe webhook event ${event.id}.`);
    }

    try {
      await this.processEvent(event);
      await record
        .$query()
        .patch({ processedAt: new Date(), error: null } as never);
    } catch (error) {
      const message = (error as Error).message || 'Unknown webhook error';
      this.logger.error(`Stripe webhook ${event.id} failed: ${message}`);
      await record.$query().patch({ error: message.slice(0, 2000) } as never);
      throw error;
    }
  }

  /**
   * Dispatches a verified Stripe event.
   */
  private async processEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await this.handleSubscriptionChange(
          event.data.object as Stripe.Subscription,
        );
        break;

      case 'invoice.paid':
      case 'invoice.payment_succeeded':
        await this.handleInvoicePayment(
          event.data.object as Stripe.Invoice,
          SubscriptionPaymentStatus.Succeed,
        );
        break;

      case 'invoice.payment_failed':
        await this.handleInvoicePayment(
          event.data.object as Stripe.Invoice,
          SubscriptionPaymentStatus.Failed,
        );
        break;

      default:
        this.logger.debug(`Unhandled Stripe Billing event: ${event.type}`);
    }
  }

  /**
   * Handles a completed Checkout Session.
   */
  private async handleCheckoutCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    if (!session.subscription) return;

    const tenantId =
      this.getTenantIdFromMetadata(session.metadata) ||
      (await this.findTenantIdByCustomer(session.customer));
    if (!tenantId) {
      throw new Error(
        `Unable to resolve the tenant for checkout session ${session.id}.`,
      );
    }

    const subscription = await this.stripeBilling.stripe.subscriptions.retrieve(
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription.id,
    );
    await this.syncService.syncFromStripeSubscription(tenantId, subscription);
  }

  /**
   * Handles created/updated/deleted subscription events.
   */
  private async handleSubscriptionChange(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const tenantId =
      this.getTenantIdFromMetadata(subscription.metadata) ||
      (await this.findTenantIdByCustomer(subscription.customer));
    if (!tenantId) {
      throw new Error(
        `Unable to resolve the tenant for Stripe subscription ${subscription.id}.`,
      );
    }
    await this.syncService.syncFromStripeSubscription(tenantId, subscription);
  }

  /**
   * Marks the local subscription payment status from an invoice event.
   */
  private async handleInvoicePayment(
    invoice: Stripe.Invoice,
    status: SubscriptionPaymentStatus,
  ): Promise<void> {
    const subscriptionId = invoice.subscription
      ? typeof invoice.subscription === 'string'
        ? invoice.subscription
        : invoice.subscription.id
      : null;

    let localSubscription = subscriptionId
      ? await this.planSubscriptionModel
          .query()
          .findOne({ stripeSubscriptionId: subscriptionId })
      : null;

    if (!localSubscription && subscriptionId) {
      const tenantId = await this.findTenantIdByCustomer(invoice.customer);
      if (tenantId) {
        const stripeSubscription =
          await this.stripeBilling.stripe.subscriptions.retrieve(
            subscriptionId,
          );
        await this.syncService.syncFromStripeSubscription(
          tenantId,
          stripeSubscription,
        );
        // Re-query by the invoice's subscription id so an old invoice never
        // mutates a newer subscription that replaced it.
        localSubscription = await this.planSubscriptionModel
          .query()
          .findOne({ stripeSubscriptionId: subscriptionId });
      }
    }

    if (!localSubscription) {
      this.logger.warn(
        `Unable to find a local subscription for Stripe invoice ${invoice.id}.`,
      );
      return;
    }

    await localSubscription.$query().patch({ paymentStatus: status } as never);

    const eventName =
      status === SubscriptionPaymentStatus.Succeed
        ? events.subscription.onSubscriptionPaymentSucceed
        : events.subscription.onSubscriptionPaymentFailed;

    await this.eventEmitter.emitAsync(eventName, {
      subscriptionSlug: localSubscription.slug || 'main',
    });
  }

  /**
   * Reads a numeric tenant id from Stripe metadata.
   */
  private getTenantIdFromMetadata(
    metadata?: Stripe.Metadata | null,
  ): number | null {
    const raw = metadata?.tenantId || metadata?.tenant_id;
    const tenantId = Number(raw);
    return Number.isFinite(tenantId) && tenantId > 0 ? tenantId : null;
  }

  /**
   * Resolves the tenant by its Stripe customer id.
   */
  private async findTenantIdByCustomer(
    customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
  ): Promise<number | null> {
    if (!customer) return null;
    const customerId = typeof customer === 'string' ? customer : customer.id;
    const tenant = await this.tenantModel
      .query()
      .findOne({ stripeCustomerId: customerId });
    return tenant?.id ?? null;
  }
}
