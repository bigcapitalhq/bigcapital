import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Plan } from '../models/Plan';
import { PlanSubscription } from '../models/PlanSubscription';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS, IStripeCheckoutSession } from '../types';
import { StripeBillingService } from './StripeBillingService';
import { StripePlanSyncService } from './StripePlanSyncService';

@Injectable()
export class CreateStripeCheckoutSessionService {
  constructor(
    private readonly stripeBilling: StripeBillingService,
    private readonly stripePlanSync: StripePlanSyncService,
    private readonly tenancyContext: TenancyContext,
    private readonly configService: ConfigService,

    @Inject(Plan.name)
    private readonly planModel: typeof Plan,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Creates a hosted Stripe Checkout session for the current organization.
   */
  public async execute(planSlug: string): Promise<IStripeCheckoutSession> {
    this.stripeBilling.assertBillingAvailable();

    const tenant = await this.tenancyContext.getTenant(true);
    const user = await this.tenancyContext.getSystemUser();

    const plan = await this.planModel
      .query()
      .findOne({ slug: planSlug, active: true })
      .throwIfNotFound();

    const existingSubscription = await this.planSubscriptionModel
      .query()
      .findOne({ tenantId: tenant.id, slug: 'main' });

    if (
      existingSubscription?.active() &&
      (existingSubscription.stripeSubscriptionId ||
        existingSubscription.lemonSubscriptionId)
    ) {
      throw new ServiceError(
        ERRORS.SUBSCRIPTION_ALREADY_ACTIVE,
        'This organization already has an active subscription.',
      );
    }

    const syncedPlan = await this.stripePlanSync.ensurePlanSynced(plan);
    const customer = await this.stripeBilling.getOrCreateCustomer(tenant, user);

    const baseUrl = this.configService.get<string>('app.baseUrl');

    if (!baseUrl) {
      throw new ServiceError(
        ERRORS.BASE_URL_NOT_CONFIGURED,
        'The application base URL is not configured. Set BASE_URL.',
      );
    }

    const successUrl =
      this.configService.get<string>('stripeBilling.successUrl') ||
      `${baseUrl}/preferences/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl =
      this.configService.get<string>('stripeBilling.cancelUrl') ||
      `${baseUrl}/preferences/billing?checkout=cancel`;

    const metadata = {
      tenantId: String(tenant.id),
      organizationId: tenant.organizationId,
      planSlug: syncedPlan.slug,
      userId: String(user.id),
    };

    const session = await this.stripeBilling.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      client_reference_id: String(tenant.id),
      line_items: [{ price: syncedPlan.stripePriceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      subscription_data: { metadata },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_update: { address: 'auto', name: 'auto' },
    });

    if (!session.url) {
      throw new ServiceError(
        ERRORS.STRIPE_CHECKOUT_SESSION_FAILED,
        'Unable to create the Stripe checkout session.',
      );
    }

    return { url: session.url, sessionId: session.id };
  }
}
