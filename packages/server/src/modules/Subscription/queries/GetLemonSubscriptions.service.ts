import { Inject, Injectable } from '@nestjs/common';
import { getSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { PromisePool } from '@supercharge/promise-pool';
import { configureLemonSqueezy } from '../utils';
import { PlanSubscription } from '../models/PlanSubscription';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

/**
 * Lemon Squeezy subscription details for the current tenant's subscriptions.
 * Isolates the slow third-party API call behind its own endpoint so the
 * system-subscriptions list (`GetSubscriptionsService`) stays fast and lemon-free.
 */
@Injectable()
export class GetLemonSubscriptionsService {
  constructor(
    private readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  public async getLemonSubscriptions() {
    configureLemonSqueezy();

    const tenant = await this.tenancyContext.getTenant();
    const subscriptions = await this.planSubscriptionModel
      .query()
      .where('tenant_id', tenant.id);

    const { results } = await PromisePool.withConcurrency(1)
      .for(subscriptions)
      .process(async (subscription) => {
        if (!subscription.lemonSubscriptionId) {
          return null;
        }
        const res = await getSubscription(subscription.lemonSubscriptionId);
        if (res.error) {
          return null;
        }
        return {
          slug: subscription.slug,
          urls: res.data?.data?.attributes?.urls ?? {},
        };
      });

    return results.filter((entry) => entry !== null);
  }
}
