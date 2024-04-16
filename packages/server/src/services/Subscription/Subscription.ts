import { Service } from 'typedi';
import { NotAllowedChangeSubscriptionPlan } from '@/exceptions';
import { Plan, Tenant } from '@/system/models';

@Service()
export class Subscription {
  /**
   * Give the tenant a new subscription.
   * @param {number} tenantId - Tenant id.
   * @param {string} planSlug - Plan slug.
   * @param {string} invoiceInterval
   * @param {number} invoicePeriod
   * @param {string} subscriptionSlug
   */
  public async newSubscribtion(
    tenantId: number,
    planSlug: string,
    subscriptionSlug: string = 'main'
  ) {
    const tenant = await Tenant.query().findById(tenantId).throwIfNotFound();
    const plan = await Plan.query().findOne('slug', planSlug).throwIfNotFound();

    const isFree = plan.price === 0;

    // Take the invoice interval and period from the given plan.
    const invoiceInterval = plan.invoiceInternal;
    const invoicePeriod = isFree ? Infinity : plan.invoicePeriod;

    const subscription = await tenant
      .$relatedQuery('subscriptions')
      .modify('subscriptionBySlug', subscriptionSlug)
      .first();

    // No allowed to re-new the the subscription while the subscription is active.
    if (subscription && subscription.active()) {
      throw new NotAllowedChangeSubscriptionPlan();

      // In case there is already subscription associated to the given tenant renew it.
    } else if (subscription && subscription.inactive()) {
      await subscription.renew(invoiceInterval, invoicePeriod);

      // No stored past tenant subscriptions create new one.
    } else {
      await tenant.newSubscription(
        plan.id,
        invoiceInterval,
        invoicePeriod,
        subscriptionSlug
      );
    }
  }
}
