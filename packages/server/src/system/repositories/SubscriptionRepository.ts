import SystemRepository from '@/system/repositories/SystemRepository';
import { PlanSubscription } from '@/system/models';

export default class SubscriptionRepository extends SystemRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return PlanSubscription.bindKnex(this.knex);
  }

  /**
   * Retrieve subscription from a given slug in specific tenant.
   * @param {string} slug
   * @param {number} tenantId
   */
  getBySlugInTenant(slug: string, tenantId: number) {
    return PlanSubscription.query()
      .findOne('slug', slug)
      .where('tenant_id', tenantId);
  }
}
