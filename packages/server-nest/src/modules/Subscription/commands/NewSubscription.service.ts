import { SubscriptionPayload } from '@/interfaces/SubscriptionPlan';
import { Inject, Injectable } from '@nestjs/common';
import { PlanSubscription } from '../models/PlanSubscription';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Plan } from '../models/Plan';

@Injectable()
export class NewSubscriptionService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,

    @Inject(Plan.name)
    private readonly planModel: typeof Plan,
  ) {}

  /**
   * Give the tenant a new subscription.
   * @param {string} planSlug - Plan slug of the new subscription.
   * @param {string} subscriptionSlug - Subscription slug by default takes main subscription
   * @param {SubscriptionPayload} payload - Subscription payload.
   */
  public async execute(
    planSlug: string,
    subscriptionSlug: string = 'main',
    payload?: SubscriptionPayload,
  ): Promise<void> {
    const tenant = await this.tenancyContext.getTenant();
    const plan = await this.planModel
      .query()
      .findOne('slug', planSlug)
      .throwIfNotFound();

    const isFree = plan.price === 0;

    // Take the invoice interval and period from the given plan.
    const invoiceInterval = plan.invoiceInternal;
    const invoicePeriod = isFree ? Infinity : plan.invoicePeriod;

    const subscription = await tenant
      .$relatedQuery('subscriptions')
      .modify('subscriptionBySlug', subscriptionSlug)
      .first();

    // No allowed to re-new the the subscription while the subscription is active.
    if (subscription && subscription.active()) {
      throw new NotAllowedChangeSubscriptionPlan();

      // In case there is already subscription associated to the given tenant renew it.
    } else if (subscription && subscription.inactive()) {
      await subscription.renew(invoiceInterval, invoicePeriod);

      // No stored past tenant subscriptions create new one.
    } else {
      await tenant.newSubscription(
        plan.id,
        invoiceInterval,
        invoicePeriod,
        subscriptionSlug,
        payload,
      );
    }
  }
}
