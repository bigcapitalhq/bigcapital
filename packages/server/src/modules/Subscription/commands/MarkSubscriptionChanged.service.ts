import { Inject, Injectable } from '@nestjs/common';
import { PlanSubscription } from '../models/PlanSubscription';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Plan } from '../models/Plan';
import { ServiceError } from '@/modules/Items/ServiceError';
import { events } from '@/common/events/events';

@Injectable()
export class MarkSubscriptionPlanChanged {
  constructor(
    public readonly eventEmitter: EventEmitter2,
    public readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Mark the given subscription payment of the tenant as succeed.
   * @param {string} newPlanSlug - New plan slug.
   * @param {string} subscriptionSlug - Subscription slug.
   */
  async execute(
    newPlanSlug: string,
    subscriptionSlug: string = 'main',
  ): Promise<void> {
    const tenant = await this.tenancyContext.getTenant();
    const newPlan = await Plan.query()
      .findOne('slug', newPlanSlug)
      .throwIfNotFound();

    const subscription = await this.planSubscriptionModel.query().findOne({
      tenantId: tenant.id,
      slug: subscriptionSlug,
    });
    if (subscription.planId === newPlan.id) {
      throw new ServiceError('');
    }
    await subscription.$query().patch({ planId: newPlan.id });

    // Triggers `onSubscriptionPlanChanged` event.
    await this.eventEmitter.emitAsync(
      events.subscription.onSubscriptionPlanChanged,
      { newPlanSlug, subscriptionSlug },
    );
  }
}
