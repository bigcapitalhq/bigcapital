import { Inject, Service } from 'typedi';
import { cancelSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { configureLemonSqueezy } from './utils';
import { PlanSubscription } from '@/system/models';
import { ServiceError } from '@/exceptions';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { ERRORS, IOrganizationSubscriptionCancel } from './types';
import events from '@/subscribers/events';

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
  public async cancelSubscription(
    tenantId: number,
    subscriptionSlug: string = 'main'
  ) {
    configureLemonSqueezy();

    const subscription = await PlanSubscription.query().findOne({
      tenantId,
      slug: subscriptionSlug,
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
    // Triggers `onSubscriptionCancelled` event.
    await this.eventPublisher.emitAsync(
      events.subscription.onSubscriptionCancel,
      { tenantId, subscriptionId } as IOrganizationSubscriptionCancel
    );
  }
}
