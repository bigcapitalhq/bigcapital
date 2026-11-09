import { Inject, Injectable } from '@nestjs/common';
import { GetSubscriptionsTransformer } from './GetSubscriptionsTransformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { PlanSubscription } from '../models/PlanSubscription';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class GetSubscriptionsService {
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly tenancyContext: TenancyContext,

    @Inject(PlanSubscription.name)
    private readonly planSubscriptionModel: typeof PlanSubscription,
  ) {}

  /**
   * Retrieve all system subscriptions of the given tenant.
   * (Lemon Squeezy details are fetched separately via GetLemonSubscriptionsService.)
   */
  public async getSubscriptions() {
    const tenant = await this.tenancyContext.getTenant();
    const subscriptions = await this.planSubscriptionModel
      .query()
      .where('tenant_id', tenant.id)
      .withGraphFetched('plan');

    return this.transformer.transform(
      subscriptions,
      new GetSubscriptionsTransformer(),
      {},
    );
  }
}
