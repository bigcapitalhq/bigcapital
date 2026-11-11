import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type Stripe from 'stripe';
import { events } from '@/common/events/events';
import { Plan } from '../models/Plan';
import { PlanSubscription } from '../models/PlanSubscription';
import { TenantModel } from '@/modules/System/models/TenantModel';

@Injectable()
export class SyncStripeSubscriptionService {
  private readonly logger = new Logger(SyncStripeSubscriptionService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,

    @Inject(Plan.name)
    private readonly planModel: typeof Plan,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,
  ) {}

  /**
   * Synchronizes a Stripe subscription into the local system database.
   */
  public async syncFromStripeSubscription(
    tenantId: number,
    subscription: Stripe.Subscription,
  ): Promise<PlanSubscription> {
    const tenant = await this.tenantModel
      .query()
      .findById(tenantId)
      .throwIfNotFound();

    const plan = await this.resolvePlan(subscription);
    if (!plan) {
      throw new Error(
        `No local plan is linked to Stripe subscription ${subscription.id}.`,
      );
    }

    const subscriptionItem = subscription.items?.data?.[0];
    const priceId = subscriptionItem?.price?.id;
    const periodStart =
      (subscription as unknown as { current_period_start?: number })
        .current_period_start ??
      (subscriptionItem as unknown as { current_period_start?: number })
        ?.current_period_start;
    const periodEnd =
      (subscription as unknown as { current_period_end?: number })
        .current_period_end ??
      (subscriptionItem as unknown as { current_period_end?: number })
        ?.current_period_end;

    const previous = await this.planSubscriptionModel
      .query()
      .findOne({ tenantId, slug: 'main' });

    // Ignore stale events from an older Stripe subscription. This can happen
    // when an organization cancels and later resubscribes: the old
    // `customer.subscription.deleted` event may arrive after the new
    // subscription has already been synced.
    if (
      previous?.stripeSubscriptionId &&
      previous.stripeSubscriptionId !== subscription.id
    ) {
      const incomingActive = ['active', 'trialing', 'past_due'].includes(
        subscription.status,
      );
      if (previous.active() || !incomingActive) {
        this.logger.warn(
          `Ignoring stale Stripe subscription ${subscription.id} for tenant ${tenantId}.`,
        );
        return previous;
      }
    }

    const wasProviderActive = previous
      ? previous.active() &&
        !!(previous.stripeSubscriptionId || previous.lemonSubscriptionId)
      : false;
    const cancelAtPeriodEnd = !!subscription.cancel_at_period_end;
    const isActiveAfter = ['active', 'trialing', 'past_due'].includes(
      subscription.status,
    );

    const patch = {
      planId: plan.id,
      stripeSubscriptionId: subscription.id,
      stripeStatus: subscription.status,
      stripePriceId: priceId || null,
      cancelAtPeriodEnd,
      startsAt: periodStart ? new Date(periodStart * 1000) : previous?.startsAt,
      endsAt: periodEnd ? new Date(periodEnd * 1000) : previous?.endsAt,
      canceledAt:
        subscription.status === 'canceled' && subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : null,
      trialEndsAt: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    };

    let localSubscription: PlanSubscription;
    if (!previous) {
      localSubscription = await this.planSubscriptionModel.query().insert({
        tenantId,
        slug: 'main',
        planId: plan.id,
        stripeSubscriptionId: subscription.id,
        stripeStatus: subscription.status,
        stripePriceId: priceId || null,
        cancelAtPeriodEnd,
        startsAt: patch.startsAt,
        endsAt: patch.endsAt,
        canceledAt: patch.canceledAt,
        trialEndsAt: patch.trialEndsAt,
      });
    } else {
      localSubscription = await previous.$query().patchAndFetch(patch);
    }

    const customerId =
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id;
    if (customerId && tenant.stripeCustomerId !== customerId) {
      await tenant.$query().patch({ stripeCustomerId: customerId } as never);
    }

    await this.emitSubscriptionEvents({
      previous,
      next: localSubscription,
      wasProviderActive,
      isActiveAfter,
      plan,
    });

    return localSubscription;
  }

  /**
   * Resolves the local plan from the Stripe subscription metadata or price.
   */
  private async resolvePlan(
    subscription: Stripe.Subscription,
  ): Promise<Plan | undefined> {
    // Prefer the actual Stripe price so a pending plan change cannot make the
    // local plan diverge from what the customer is actually subscribed to.
    const priceId = subscription.items?.data?.[0]?.price?.id;
    let plan = priceId
      ? await this.planModel.query().findOne({ stripePriceId: priceId })
      : undefined;

    if (!plan) {
      const planSlug = subscription.metadata?.planSlug;
      if (planSlug) {
        plan = await this.planModel.query().findOne({ slug: planSlug });
      }
    }
    return plan;
  }

  /**
   * Emits the appropriate subscription lifecycle events after a sync.
   */
  private async emitSubscriptionEvents({
    previous,
    next,
    wasProviderActive,
    isActiveAfter,
    plan,
  }: {
    previous?: PlanSubscription;
    next: PlanSubscription;
    wasProviderActive: boolean;
    isActiveAfter: boolean;
    plan: Plan;
  }) {
    const subscriptionSlug = next.slug || 'main';

    if (!previous || (!wasProviderActive && isActiveAfter)) {
      await this.eventEmitter.emitAsync(
        events.subscription.onSubscriptionSubscribed,
        { subscriptionSlug },
      );
    }
    if (previous && Number(previous.planId) !== Number(plan.id)) {
      await this.eventEmitter.emitAsync(
        events.subscription.onSubscriptionPlanChanged,
        { newPlanSlug: plan.slug, subscriptionSlug },
      );
    }
    if (previous && !previous.cancelAtPeriodEnd && next.cancelAtPeriodEnd) {
      await this.eventEmitter.emitAsync(
        events.subscription.onSubscriptionCancelled,
        { subscriptionSlug },
      );
    }
    if (previous && previous.cancelAtPeriodEnd && !next.cancelAtPeriodEnd) {
      await this.eventEmitter.emitAsync(
        events.subscription.onSubscriptionResumed,
        { subscriptionSlug },
      );
    }
  }
}
