import { Inject, Injectable } from '@nestjs/common';
import { Plan } from '../models/Plan';
import { PlanSubscription } from '../models/PlanSubscription';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../types';
import { StripeBillingService } from './StripeBillingService';
import { StripePlanSyncService } from './StripePlanSyncService';
import { SyncStripeSubscriptionService } from './SyncStripeSubscription.service';

@Injectable()
export class ChangeStripeSubscriptionService {
  constructor(
    private readonly stripeBilling: StripeBillingService,
    private readonly stripePlanSync: StripePlanSyncService,
    private readonly syncService: SyncStripeSubscriptionService,
    private readonly tenancyContext: TenancyContext,

    @Inject(Plan.name)
    private readonly planModel: typeof Plan,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Changes the current Stripe subscription to the given plan.
   */
  public async execute(planSlug: string): Promise<void> {
    this.stripeBilling.assertBillingAvailable();

    const tenant = await this.tenancyContext.getTenant();
    const subscription = await this.planSubscriptionModel
      .query()
      .findOne({ tenantId: tenant.id, slug: 'main' });

    if (!subscription?.stripeSubscriptionId) {
      throw new ServiceError(
        ERRORS.STRIPE_SUBSCRIPTION_NOT_FOUND,
        'This organization has no Stripe subscription.',
      );
    }

    const plan = await this.planModel
      .query()
      .findOne({ slug: planSlug, active: true })
      .throwIfNotFound();

    if (Number(subscription.planId) === Number(plan.id)) {
      throw new ServiceError(
        'SUBSCRIPTION_PLAN_ALREADY_ACTIVE',
        'The organization is already subscribed to this plan.',
      );
    }

    const syncedPlan = await this.stripePlanSync.ensurePlanSynced(plan);
    const stripeSubscription =
      await this.stripeBilling.stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId,
      );

    const subscriptionItem = stripeSubscription.items.data[0];
    if (!subscriptionItem) {
      throw new ServiceError(
        ERRORS.STRIPE_SUBSCRIPTION_NOT_FOUND,
        'The Stripe subscription has no items.',
      );
    }

    const updated = await this.stripeBilling.stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        items: [{ id: subscriptionItem.id, price: syncedPlan.stripePriceId }],
        proration_behavior: 'create_prorations',
        metadata: {
          ...stripeSubscription.metadata,
          planSlug: syncedPlan.slug,
        },
      },
    );

    await this.syncService.syncFromStripeSubscription(tenant.id, updated);
  }
}
