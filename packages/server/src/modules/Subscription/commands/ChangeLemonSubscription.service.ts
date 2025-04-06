
import { updateSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { configureLemonSqueezy } from '../utils';
import { IOrganizationSubscriptionChanged } from '../types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { PlanSubscription } from '../models/PlanSubscription';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class ChangeLemonSubscription {
  constructor(
    public readonly eventEmitter: EventEmitter2,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Changes the given organization subscription plan.
   * @param {number} tenantId - Tenant id.
   * @param {number} newVariantId - New variant id.
   * @returns {Promise<void>}
   */
  public async changeSubscriptionPlan(
    newVariantId: number,
    subscriptionSlug: string = 'main',
  ) {
    configureLemonSqueezy();

    const subscription = await this.planSubscriptionModel.query().findOne({
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
    await this.eventEmitter.emitAsync(
      events.subscription.onSubscriptionPlanChange,
      {
        lemonSubscriptionId,
        newVariantId,
      } as IOrganizationSubscriptionChanged,
    );
  }
}
