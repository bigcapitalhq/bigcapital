import { fromPairs } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { getSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { PromisePool } from '@supercharge/promise-pool';
import { GetSubscriptionsTransformer } from './GetSubscriptionsTransformer';
import { configureLemonSqueezy } from '../utils';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { PlanSubscription } from '../models/PlanSubscription';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class GetSubscriptionsService {
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Retrieve all subscription of the given tenant.
   * @param {number} tenantId
   */
  public async getSubscriptions() {
    configureLemonSqueezy();

    const tenant = await this.tenancyContext.getTenant();
    const subscriptions = await this.planSubscriptionModel
      .query()
      .where('tenant_id', tenant.id)
      .withGraphFetched('plan');

    const lemonSubscriptionsResult = await PromisePool.withConcurrency(1)
      .for(subscriptions)
      .process(async (subscription, index, pool) => {
        if (subscription.lemonSubscriptionId) {
          const res = await getSubscription(subscription.lemonSubscriptionId);

          if (res.error) {
            return;
          }
          return [subscription.lemonSubscriptionId, res.data];
        }
      });
    const lemonSubscriptions = fromPairs(
      lemonSubscriptionsResult?.results.filter((result) => !!result[1]),
    );
    return this.transformer.transform(
      subscriptions,
      new GetSubscriptionsTransformer(),
      {
        lemonSubscriptions,
      },
    );
  }
}
