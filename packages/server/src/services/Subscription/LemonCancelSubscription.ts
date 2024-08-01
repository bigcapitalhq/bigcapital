import { Inject, Service } from 'typedi';
import { cancelSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { configureLemonSqueezy } from './utils';
import { PlanSubscription } from '@/system/models';
import { ServiceError } from '@/exceptions';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { ERRORS, IOrganizationSubscriptionCanceled } from './types';

@Service()
export class LemonCancelSubscription {
  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Cancels the subscription of the given tenant.
   * @param {number} tenantId
   * @param {number} subscriptionId
   * @returns {Promise<void>}
   */
  public async cancelSubscription(tenantId: number) {
    configureLemonSqueezy();

    const subscription = await PlanSubscription.query().findOne({
      tenantId,
      slug: 'main',
    });
    if (!subscription) {
      throw new ServiceError(ERRORS.SUBSCRIPTION_ID_NOT_ASSOCIATED_TO_TENANT);
    }
    const lemonSusbcriptionId = subscription.lemonSubscriptionId;
    const subscriptionId = subscription.id;
    const cancelledSub = await cancelSubscription(lemonSusbcriptionId);

    if (cancelledSub.error) {
      throw new Error(cancelledSub.error.message);
    }
    await PlanSubscription.query().findById(subscriptionId).patch({
      canceledAt: new Date(),
    });
    // Triggers `onSubscriptionCanceled` event.
    await this.eventPublisher.emitAsync(
      events.subscription.onSubscriptionCanceled,
      { tenantId, subscriptionId } as IOrganizationSubscriptionCanceled
    );
  }
}
