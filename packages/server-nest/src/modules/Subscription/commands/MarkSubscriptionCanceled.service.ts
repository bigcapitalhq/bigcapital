import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlanSubscription } from '../models/PlanSubscription';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../types';
import { events } from '@/common/events/events';

@Injectable()
export class MarkSubscriptionCanceled {
  constructor(
    public readonly eventEmitter: EventEmitter2,
    public readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}
  /**
   * Cancels the given tenant subscription.
   * @param {string} subscriptionSlug - Subscription slug.
   */
  async execute(subscriptionSlug: string = 'main'): Promise<void> {
    const tenant = await this.tenancyContext.getTenant();
    const subscription = await this.planSubscriptionModel.query().findOne({
      tenantId: tenant.id,
      slug: subscriptionSlug,
    });
    // Throw error early if the subscription is not exist.
    if (!subscription) {
      throw new ServiceError(ERRORS.SUBSCRIPTION_NOT_EXIST);
    }
    // Throw error early if the subscription is already canceled.
    if (subscription.canceled()) {
      throw new ServiceError(ERRORS.SUBSCRIPTION_ALREADY_CANCELED);
    }
    await subscription.$query().patch({ canceledAt: new Date() });

    // Triggers `onSubscriptionCancelled` event.
    await this.eventEmitter.emitAsync(
      events.subscription.onSubscriptionCancelled,
      {
        subscriptionSlug,
      },
    );
  }
}