import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { cancelSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { configureLemonSqueezy } from '../utils';
import { ERRORS, IOrganizationSubscriptionCancel } from '../types';
import { ServiceError } from '@/modules/Items/ServiceError';
import { PlanSubscription } from '../models/PlanSubscription';
import { events } from '@/common/events/events';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class CancelLemonSubscription {
  constructor(
    public readonly eventEmitter: EventEmitter2,
    public readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Cancels the subscription of the given tenant.
   * @param {number} subscriptionId - Subscription id.
   * @returns {Promise<void>}
   */
  public async cancelSubscription(
    subscriptionSlug: string = 'main',
  ) {
    configureLemonSqueezy();

    const tenant = await this.tenancyContext.getTenant();
    const subscription = await this.planSubscriptionModel.query().findOne({
      tenantId: tenant.id,
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
    await this.eventEmitter.emitAsync(
      events.subscription.onSubscriptionCancel,
      { subscriptionId } as IOrganizationSubscriptionCancel,
    );
  }
}
