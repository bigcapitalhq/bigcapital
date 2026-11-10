import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { PlanSubscription } from '../models/PlanSubscription';
import { ERRORS } from '../types';

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

    let tenant: { id: number } | undefined;

    try {
      tenant = await this.tenancyContext.getTenant();
    } catch {
      tenant = undefined;
    }

    if (!tenant) return;

    const subscription = (await this.planSubscriptionModel
      .query()
      .findOne({ tenantId: tenant.id, slug: 'main' })) as
      | PlanSubscription
      | undefined;

    if (subscription?.active()) {
      const hasBillingProvider = !!(
        subscription.stripeSubscriptionId || subscription.lemonSubscriptionId
      );
      if (hasBillingProvider || subscription.onTrial()) {
        return;
      }
    }

    const trialExpired = subscription?.trialExpired() === true;
    const message = trialExpired
      ? 'Your free trial has ended. Subscribe to Go to keep making changes.'
      : 'Organization subscription is inactive.';

    throw new BadRequestException({
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
}
