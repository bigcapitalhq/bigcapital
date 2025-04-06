import { updateSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { configureLemonSqueezy } from '../utils';
import { ERRORS, IOrganizationSubscriptionResume } from '../types';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlanSubscription } from '../models/PlanSubscription';
import { ServiceError } from '@/modules/Items/ServiceError';
import { events } from '@/common/events/events';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class ResumeLemonSubscription {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Resumes the main subscription of the given tenant.
   * @param {string} subscriptionSlug - Subscription slug by default main subscription.
   * @returns {Promise<void>}
   */
  public async resumeSubscription(subscriptionSlug: string = 'main') {
    configureLemonSqueezy();

    const tenant = await this.tenancyContext.getTenant();
    const subscription = await this.planSubscriptionModel.query().findOne({
      tenantId: tenant.id,
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
      { subscriptionId } as IOrganizationSubscriptionResume,
    );
  }
}
