import { Inject, Service } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { configureLemonSqueezy } from './utils';
import { PlanSubscription } from '@/system/models';
import { ServiceError } from '@/exceptions';
import { ERRORS, IOrganizationSubscriptionResumed } from './types';
import { updateSubscription } from '@lemonsqueezy/lemonsqueezy.js';

@Service()
export class LemonResumeSubscription {
  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Resumes the main subscription of the given tenant.
   * @param {number} tenantId -
   * @returns {Promise<void>}
   */
  public async resumeSubscription(tenantId: number) {
    configureLemonSqueezy();

    const subscription = await PlanSubscription.query().findOne({
      tenantId,
      slug: 'main',
    });
    if (!subscription) {
      throw new ServiceError(ERRORS.SUBSCRIPTION_ID_NOT_ASSOCIATED_TO_TENANT);
    }
    const subscriptionId = subscription.id;
    const lemonSubscriptionId = subscription.lemonSubscriptionId;
    const returnedSub = await updateSubscription(lemonSubscriptionId, {
      cancelled: false,
    });
    if (returnedSub.error) {
      throw new ServiceError('');
    }
    // Update the subscription of the organization.
    await PlanSubscription.query().findById(subscriptionId).patch({
      canceledAt: null,
    });
    // Triggers `onSubscriptionCanceled` event.
    await this.eventPublisher.emitAsync(
      events.subscription.onSubscriptionResumed,
      { tenantId, subscriptionId } as IOrganizationSubscriptionResumed
    );
  }
}
