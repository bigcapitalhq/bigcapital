import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { PlanSubscription } from '../models/PlanSubscription';
import { SubscriptionPaymentStatus } from '@/interfaces/SubscriptionPlan';
import { events } from '@/common/events/events';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class MarkSubscriptionPaymentFailed {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Marks the given subscription payment of the tenant as failed.
   * @param {string} subscriptionSlug - Given subscription slug.
   * @returns {Prmise<void>}
   */
  async execute(subscriptionSlug: string = 'main'): Promise<void> {
    const tenant = await this.tenancyContext.getTenant();
    const subscription = await this.planSubscriptionModel
      .query()
      .findOne({ tenantId: tenant.id, slug: subscriptionSlug })
      .throwIfNotFound();

    await subscription
      .$query()
      .patch({ paymentStatus: SubscriptionPaymentStatus.Failed });

    // Triggers `onSubscriptionPaymentFailed` event.
    await this.eventEmitter.emitAsync(
      events.subscription.onSubscriptionPaymentFailed,
      {
        subscriptionSlug,
      },
    );
  }
}
