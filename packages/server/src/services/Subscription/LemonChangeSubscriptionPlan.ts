import { Inject, Service } from 'typedi';
import { updateSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { ServiceError } from '@/exceptions';
import { PlanSubscription } from '@/system/models';
import { configureLemonSqueezy } from './utils';
import events from '@/subscribers/events';
import { IOrganizationSubscriptionChanged } from './types';

@Service()
export class LemonChangeSubscriptionPlan {
  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Changes the given organization subscription plan.
   * @param {number} tenantId - Tenant id.
   * @param {number} newVariantId - New variant id.
   * @returns {Promise<void>}
   */
  public async changeSubscriptionPlan(
    tenantId: number,
    newVariantId: number,
    subscriptionSlug: string = 'main'
  ) {
    configureLemonSqueezy();

    const subscription = await PlanSubscription.query().findOne({
      tenantId,
      slug: subscriptionSlug,
    });
    const lemonSubscriptionId = subscription.lemonSubscriptionId;

    // Send request to Lemon Squeezy to change the subscription.
    const updatedSub = await updateSubscription(lemonSubscriptionId, {
      variantId: newVariantId,
      invoiceImmediately: true,
    });
    if (updatedSub.error) {
      throw new ServiceError('SOMETHING_WENT_WRONG');
    }
    // Triggers `onSubscriptionPlanChanged` event.
    await this.eventPublisher.emitAsync(
      events.subscription.onSubscriptionPlanChange,
      {
        tenantId,
        lemonSubscriptionId,
        newVariantId,
      } as IOrganizationSubscriptionChanged
    );
  }
}
