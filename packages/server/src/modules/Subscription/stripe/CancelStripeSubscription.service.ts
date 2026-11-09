import { Inject, Injectable } from '@nestjs/common';
import { PlanSubscription } from '../models/PlanSubscription';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../types';
import { StripeBillingService } from './StripeBillingService';
import { SyncStripeSubscriptionService } from './SyncStripeSubscription.service';

@Injectable()
export class CancelStripeSubscriptionService {
  constructor(
    private readonly stripeBilling: StripeBillingService,
    private readonly syncService: SyncStripeSubscriptionService,
    private readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Cancels the current Stripe subscription at the end of the billing period.
   */
  public async execute(): Promise<void> {
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

    if (subscription.cancelAtPeriodEnd) {
      throw new ServiceError(
        ERRORS.SUBSCRIPTION_ALREADY_CANCELED,
        'The subscription is already scheduled for cancellation.',
      );
    }

    const updated = await this.stripeBilling.stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      { cancel_at_period_end: true },
    );

    await this.syncService.syncFromStripeSubscription(tenant.id, updated);
  }
}
