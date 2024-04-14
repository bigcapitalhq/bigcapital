import { Service } from 'typedi';
import { PlanSubscription } from '@/system/models';

@Service()
export default class SubscriptionService {
  /**
   * Retrieve all subscription of the given tenant.
   * @param {number} tenantId
   */
  public async getSubscriptions(tenantId: number) {
    const subscriptions = await PlanSubscription.query().where(
      'tenant_id',
      tenantId
    );
    return subscriptions;
  }
}
