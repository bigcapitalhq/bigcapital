import { Inject, Service } from 'typedi';
import { updateSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { configureLemonSqueezy } from './utils';
import { PlanSubscription } from '@/system/models';
import { ServiceError } from '@/exceptions';
import { ERRORS, IOrganizationSubscriptionResume } from './types';

@Service()
export class LemonResumeSubscription {
  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Resumes the main subscription of the given tenant.
   * @param {number} tenantId - Tenant id.
   * @param {string} subscriptionSlug - Subscription slug by default main subscription.
   * @returns {Promise<void>}
   */
  public async resumeSubscription(
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
    const subscriptionId = subscription.id;
    const lemonSubscriptionId = subscription.lemonSubscriptionId;
    const returnedSub = await updateSubscription(lemonSubscriptionId, {
      cancelled: false,
    });
    if (returnedSub.error) {
      throw new ServiceError(ERRORS.SOMETHING_WENT_WRONG_WITH_LS);
    }
    // Triggers `onSubscriptionResume` event.
    await this.eventPublisher.emitAsync(
      events.subscription.onSubscriptionResume,
      { tenantId, subscriptionId } as IOrganizationSubscriptionResume
    );
  }
}
