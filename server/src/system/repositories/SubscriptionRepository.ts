import { Service, Inject } from 'typedi';
import SystemRepository from "system/repositories/SystemRepository";
import { PlanSubscription } from 'system/models'

@Service()
export default class SubscriptionRepository extends SystemRepository{
	@Inject('cache')
	cache: any;

	/**
	 * Retrieve subscription from a given slug in specific tenant.
	 * @param {string} slug 
	 * @param {number] tenantId 
	 */
	getBySlugInTenant(slug: string, tenantId: number) {
		const key = `subscription.slug.${slug}.tenant.${tenantId}`;
		return this.cache.get(key, () => {
			return PlanSubscription.query().findOne('slug', slug).where('tenant_id', tenantId);
		});
	}
}