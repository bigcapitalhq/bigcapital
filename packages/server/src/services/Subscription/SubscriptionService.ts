import { Inject, Service } from 'typedi';
import { getSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { PromisePool } from '@supercharge/promise-pool';
import { PlanSubscription } from '@/system/models';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetSubscriptionsTransformer } from './GetSubscriptionsTransformer';
import { configureLemonSqueezy } from './utils';
import { fromPairs } from 'lodash';

@Service()
export default class SubscriptionService {
  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve all subscription of the given tenant.
   * @param {number} tenantId
   */
  public async getSubscriptions(tenantId: number) {
    configureLemonSqueezy();

    const subscriptions = await PlanSubscription.query()
      .where('tenant_id', tenantId)
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
      lemonSubscriptionsResult?.results.filter((result) => !!result[1])
    );
    return this.transformer.transform(
      tenantId,
      subscriptions,
      new GetSubscriptionsTransformer(),
      {
        lemonSubscriptions,
      }
    );
  }
}
