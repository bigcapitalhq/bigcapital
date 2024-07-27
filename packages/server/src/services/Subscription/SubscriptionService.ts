import { Inject, Service } from 'typedi';
import { PlanSubscription } from '@/system/models';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetSubscriptionsTransformer } from './GetSubscriptionsTransformer';

@Service()
export default class SubscriptionService {
  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve all subscription of the given tenant.
   * @param {number} tenantId
   */
  public async getSubscriptions(tenantId: number) {
    const subscriptions = await PlanSubscription.query().where(
      'tenant_id',
      tenantId
    );
    return this.transformer.transform(
      tenantId,
      subscriptions,
      new GetSubscriptionsTransformer()
    );
  }
}
