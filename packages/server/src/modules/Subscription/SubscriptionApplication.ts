import { Injectable } from '@nestjs/common';
import { SubscriptionPayload } from '@/interfaces/SubscriptionPlan';
import { NewSubscriptionService } from './commands/NewSubscription.service';
import { GetSubscriptionsService } from './queries/GetSubscriptions.service';
import { GetPlansService } from './stripe/GetPlans.service';
import { GetBillingOverviewService } from './stripe/GetBillingOverview.service';
import { CreateStripeCheckoutSessionService } from './stripe/CreateStripeCheckoutSession.service';
import { CreateStripePortalSessionService } from './stripe/CreateStripePortalSession.service';
import { SyncStripeCheckoutSessionService } from './stripe/SyncStripeCheckoutSession.service';
import { ChangeStripeSubscriptionService } from './stripe/ChangeStripeSubscription.service';
import { CancelStripeSubscriptionService } from './stripe/CancelStripeSubscription.service';
import { ResumeStripeSubscriptionService } from './stripe/ResumeStripeSubscription.service';

@Injectable()
export class SubscriptionApplication {
  constructor(
    private readonly createNewSubscriptionService: NewSubscriptionService,
    private readonly getSubscriptionsService: GetSubscriptionsService,
    private readonly getPlansService: GetPlansService,
    private readonly getBillingOverviewService: GetBillingOverviewService,
    private readonly createStripeCheckoutSessionService: CreateStripeCheckoutSessionService,
    private readonly createStripePortalSessionService: CreateStripePortalSessionService,
    private readonly syncStripeCheckoutSessionService: SyncStripeCheckoutSessionService,
    private readonly changeStripeSubscriptionService: ChangeStripeSubscriptionService,
    private readonly cancelStripeSubscriptionService: CancelStripeSubscriptionService,
    private readonly resumeStripeSubscriptionService: ResumeStripeSubscriptionService,
  ) {}

  /**
   * Retrieves all subscriptions of the current tenant.
   */
  public getSubscriptions() {
    return this.getSubscriptionsService.getSubscriptions();
  }

  /**
   * Retrieves the Cloud plan catalog.
   */
  public getPlans() {
    return this.getPlansService.getPlans();
  }

  /**
   * Retrieves Stripe billing details (payment method, invoices, next payment).
   */
  public getBillingOverview() {
    return this.getBillingOverviewService.execute();
  }

  /**
   * Creates a hosted Stripe Checkout session for the given plan.
   */
  public createCheckoutSession(planSlug: string) {
    return this.createStripeCheckoutSessionService.execute(planSlug);
  }

  /**
   * Creates a Stripe Customer Portal session.
   */
  public createPortalSession() {
    return this.createStripePortalSessionService.execute();
  }

  /**
   * Synchronizes a completed Checkout Session right after the redirect.
   */
  public syncCheckoutSession(sessionId: string) {
    return this.syncStripeCheckoutSessionService.execute(sessionId);
  }

  /**
   * Creates a new subscription of the current tenant.
   * Used by self-hosted signups to grant the free plan.
   */
  public createNewSubscription(
    planSlug: string,
    subscriptionSlug: string = 'main',
    payload?: SubscriptionPayload,
  ) {
    return this.createNewSubscriptionService.execute(
      planSlug,
      subscriptionSlug,
      payload,
    );
  }

  /**
   * Cancels the current Stripe subscription at the period end.
   */
  public cancelSubscription() {
    return this.cancelStripeSubscriptionService.execute();
  }

  /**
   * Resumes a subscription scheduled for cancellation.
   */
  public resumeSubscription() {
    return this.resumeStripeSubscriptionService.execute();
  }

  /**
   * Changes the current Stripe subscription plan.
   */
  public changeSubscriptionPlan(planSlug: string) {
    return this.changeStripeSubscriptionService.execute(planSlug);
  }
}
