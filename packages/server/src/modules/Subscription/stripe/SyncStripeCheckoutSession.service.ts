import { Injectable } from '@nestjs/common';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../types';
import { StripeBillingService } from './StripeBillingService';
import { SyncStripeSubscriptionService } from './SyncStripeSubscription.service';

@Injectable()
export class SyncStripeCheckoutSessionService {
  constructor(
    private readonly stripeBilling: StripeBillingService,
    private readonly syncService: SyncStripeSubscriptionService,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Synchronizes the subscription linked to a completed Checkout Session.
   * Used by the Billing page right after Stripe redirects the user back so the
   * UI does not have to wait for the webhook to arrive.
   */
  public async execute(sessionId: string): Promise<void> {
    this.stripeBilling.assertBillingAvailable();

    const tenant = await this.tenancyContext.getTenant();
    const session = await this.stripeBilling.stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ['subscription'] },
    );

    const sessionTenantId = Number(
      session.metadata?.tenantId || session.client_reference_id,
    );
    if (sessionTenantId !== Number(tenant.id)) {
      throw new ServiceError(
        ERRORS.STRIPE_SESSION_NOT_FOUND,
        'The checkout session does not belong to this organization.',
      );
    }

    if (!session.subscription) return;

    const subscription = await this.stripeBilling.stripe.subscriptions.retrieve(
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription.id,
    );

    await this.syncService.syncFromStripeSubscription(tenant.id, subscription);
  }
}
