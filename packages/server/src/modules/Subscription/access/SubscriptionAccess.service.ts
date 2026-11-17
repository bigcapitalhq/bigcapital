import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { Plan } from '../models/Plan';
import { PlanSubscription } from '../models/PlanSubscription';
import { ERRORS } from '../types';
import type { RequireSubscriptionFeatureOptions } from '../decorators/RequireSubscriptionFeature.decorator';
import {
  isGoPlanFamily,
  planFamilyAllowsFeature,
} from '../SubscriptionFeatures';

type SubscriptionWithPlan = PlanSubscription & { plan?: Plan };

@Injectable()
export class SubscriptionAccessService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Whether the current installation is Bigcapital Cloud.
   */
  public isCloud(): boolean {
    return this.configService.get<boolean>('cloud.hostedOnCloud') === true;
  }

  /**
   * Throws when the current organization cannot write data.
   *
   * Self-hosted installations and contexts without a tenant are always
   * allowed. Cloud organizations may write while their paid subscription or
   * local trial is active.
   */
  public async assertCanWrite(): Promise<void> {
    if (!this.isCloud()) return;

    const tenant = await this.getTenantSafe();
    if (!tenant) return;

    const subscription = await this.getMainSubscription(tenant.id);

    if (subscription?.active()) {
      const hasBillingProvider = !!(
        subscription.stripeSubscriptionId || subscription.lemonSubscriptionId
      );
      if (hasBillingProvider || subscription.onTrial()) {
        return;
      }
    }

    throw this.buildSubscriptionError(subscription);
  }

  /**
   * Throws when the current organization's plan does not include the feature.
   *
   * Reads remain available after the subscription/trial lapses so users can
   * still access their data. The Go plan is allowed every feature.
   */
  public async assertFeatureAccess(
    feature: string,
    options: RequireSubscriptionFeatureOptions = {},
    isWrite: boolean = true,
  ): Promise<void> {
    // Subscription plans only exist on Bigcapital Cloud. Self-hosted
    // installations keep their existing feature-flag behavior.
    if (!this.isCloud()) {
      if (options.allowSelfHosted !== false) return;
      throw this.buildFeatureError(feature, options);
    }

    const tenant = await this.getTenantSafe();
    if (!tenant) return;

    const subscription = await this.getMainSubscription(tenant.id);

    // When the trial/subscription is inactive, keep read-only access.
    if (!subscription?.active()) {
      if (options.allowInactive) return;
      if (!isWrite) return;
      throw this.buildSubscriptionError(subscription);
    }

    // Trials include every feature unless the endpoint explicitly opts out.
    if (subscription.onTrial()) {
      if (options.allowTrial !== false) return;
      throw this.buildFeatureError(feature, options);
    }

    const plan = subscription.plan;
    const familySlug = plan?.familySlug || plan?.slug;

    // The Go plan has access to every feature.
    if (isGoPlanFamily(familySlug) && options.allowGoPlan !== false) {
      return;
    }

    // Explicit plan allow-list for special endpoints.
    if (
      plan &&
      options.allowPlans?.some(
        (slug) => slug === plan.slug || slug === plan.familySlug,
      )
    ) {
      return;
    }

    if (planFamilyAllowsFeature(familySlug, feature)) {
      return;
    }

    throw this.buildFeatureError(feature, options);
  }

  /**
   * Retrieves the current tenant without throwing when the request has no
   * tenant context (for example public or tenant-agnostic routes).
   */
  private async getTenantSafe(): Promise<{ id: number } | undefined> {
    try {
      return await this.tenancyContext.getTenant();
    } catch {
      return undefined;
    }
  }

  /**
   * Retrieves the organization's main subscription with its plan.
   */
  private async getMainSubscription(
    tenantId: number,
  ): Promise<SubscriptionWithPlan | undefined> {
    return (await this.planSubscriptionModel
      .query()
      .findOne({ tenantId, slug: 'main' })
      .withGraphFetched('plan')) as SubscriptionWithPlan | undefined;
  }

  /**
   * Builds the read-only subscription error.
   */
  private buildSubscriptionError(
    subscription?: PlanSubscription,
  ): BadRequestException {
    const trialExpired = subscription?.trialExpired() === true;
    const message = trialExpired
      ? 'Your free trial has ended. Subscribe to Go to keep making changes.'
      : 'Organization subscription is inactive.';

    return new BadRequestException({
      statusCode: 400,
      message,
      errors: [
        {
          type: trialExpired
            ? ERRORS.TRIAL_EXPIRED
            : ERRORS.SUBSCRIPTION_INACTIVE,
          message,
        },
      ],
    });
  }

  /**
   * Builds the plan feature denial error.
   */
  private buildFeatureError(
    feature: string,
    options: RequireSubscriptionFeatureOptions,
  ): BadRequestException {
    const label = feature.replace(/_/g, ' ');
    const message =
      options.errorMessage ||
      `The ${label} feature is not included in your current plan.`;

    return new BadRequestException({
      statusCode: 400,
      message,
      errors: [
        {
          type: options.errorType || ERRORS.FEATURE_NOT_AVAILABLE,
          message,
          payload: { feature },
        },
      ],
    });
  }
}
