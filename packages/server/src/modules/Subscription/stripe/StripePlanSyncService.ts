import { Inject, Injectable } from '@nestjs/common';
import { Plan } from '../models/Plan';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../types';
import { StripeBillingService } from './StripeBillingService';
import { ensureStripeProductAndPrice } from './plan-sync.util';

@Injectable()
export class StripePlanSyncService {
  constructor(
    private readonly stripeBilling: StripeBillingService,

    @Inject(Plan.name)
    private readonly planModel: typeof Plan,
  ) {}

  /**
   * Ensures the given plan has a Stripe product and price, then returns the
   * plan with its Stripe identifiers populated.
   */
  public async ensurePlanSynced(plan: Plan): Promise<Plan> {
    this.stripeBilling.assertBillingAvailable();

    if (Number(plan.price) <= 0) {
      throw new ServiceError(
        ERRORS.STRIPE_PLAN_NOT_LINKED,
        'The selected plan is not a paid plan.',
      );
    }

    const { productId, priceId } = await ensureStripeProductAndPrice(
      this.stripeBilling.stripe,
      plan,
    );

    if (plan.stripeProductId !== productId || plan.stripePriceId !== priceId) {
      await plan.$query().patch({
        stripeProductId: productId,
        stripePriceId: priceId,
      } as never);
    }

    return this.planModel.query().findById(plan.id).throwIfNotFound();
  }
}
