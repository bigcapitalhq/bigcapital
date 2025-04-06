import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlanSubscription } from '../models/PlanSubscription';
import { SubscriptionPaymentStatus } from '@/interfaces/SubscriptionPlan';
import { events } from '@/common/events/events';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class MarkSubscriptionPaymentSucceed {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Marks the subscription payment as succeed.
   * @param {string} subscriptionSlug - Given subscription slug by default main subscription.
   * @returns {Promise<void>}
   */
  async execute(subscriptionSlug: string = 'main'): Promise<void> {
    const tenant = await this.tenancyContext.getTenant();
    const subscription = await this.planSubscriptionModel
      .query()
      .findOne({ tenantId: tenant.id, slug: subscriptionSlug })
      .throwIfNotFound();

    await subscription
      .$query()
      .patch({ paymentStatus: SubscriptionPaymentStatus.Succeed });

    // Triggers `onSubscriptionSucceed` event.
    await this.eventEmitter.emitAsync(
      events.subscription.onSubscriptionPaymentSucceed,
      {
        subscriptionSlug,
      },
    );
  }
}
