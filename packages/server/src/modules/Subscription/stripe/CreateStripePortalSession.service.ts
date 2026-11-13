import { Injectable } from '@nestjs/common';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS, IStripePortalSession } from '../types';
import { StripeBillingService } from './StripeBillingService';

@Injectable()
export class CreateStripePortalSessionService {
  constructor(
    private readonly stripeBilling: StripeBillingService,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Creates a Stripe Customer Portal session for the current organization.
   */
  public async execute(): Promise<IStripePortalSession> {
    this.stripeBilling.assertBillingAvailable();

    const tenant = await this.tenancyContext.getTenant();

    if (!tenant.stripeCustomerId) {
      throw new ServiceError(
        ERRORS.STRIPE_CUSTOMER_NOT_FOUND,
        'This organization has no Stripe customer yet.',
      );
    }

    const session = await this.stripeBilling.createPortalSession(
      tenant.stripeCustomerId,
    );

    return { url: session.url };
  }
}
