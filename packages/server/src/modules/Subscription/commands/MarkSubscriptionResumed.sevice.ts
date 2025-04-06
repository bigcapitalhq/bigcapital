import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlanSubscription } from '../models/PlanSubscription';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../types';
import { events } from '@/common/events/events';

@Injectable()
export class MarkSubscriptionResumedService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Resumes the given tenant subscription.
   * @param {number} tenantId
   * @param {string} subscriptionSlug  - Subscription slug by deafult main subscription.
   * @returns {Promise<void>}
   */
  async execute(subscriptionSlug: string = 'main') {
    const tenant = await this.tenancyContext.getTenant();
    const subscription = await this.planSubscriptionModel.query().findOne({
      tenantId: tenant.id,
      slug: subscriptionSlug,
    });
    // Throw error early if the subscription is not exist.
    if (!subscription) {
      throw new ServiceError(ERRORS.SUBSCRIPTION_NOT_EXIST);
    }
    // Throw error early if the subscription is not cancelled.
    if (!subscription.canceled()) {
      throw new ServiceError(ERRORS.SUBSCRIPTION_ALREADY_ACTIVE);
    }
    await subscription.$query().patch({ canceledAt: null });

    // Triggers `onSubscriptionResumed` event.
    await this.eventEmitter.emitAsync(
      events.subscription.onSubscriptionResumed,
      { subscriptionSlug },
    );
  }
}
