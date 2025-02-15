import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { PlanSubscription } from '../models/PlanSubscription';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: TenantModelProxy<
      typeof PlanSubscription
    >,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Validates the tenant's subscription is exists and not inactive
   * @param {ExecutionContext} context
   * @param {string} subscriptionSlug
   * @returns {Promise<boolean>}
   */
  async canActivate(
    context: ExecutionContext,
    subscriptionSlug: string = 'main', // Default value
  ): Promise<boolean> {
    const tenant = await this.tenancyContext.getTenant();
    const subscription = await this.planSubscriptionModel()
      .query()
      .findOne('slug', subscriptionSlug)
      .where('tenant_id', tenant.id);

    if (!subscription) {
      throw new UnauthorizedException('Tenant has no subscription.');
    }

    const isSubscriptionInactive = subscription.inactive();

    if (isSubscriptionInactive) {
      throw new UnauthorizedException('Organization subscription is inactive.');
    }
    return true;
  }
}
