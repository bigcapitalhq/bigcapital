import { TenantRepository } from '@/common/repository/TenantRepository';
import { SubscriptionPeriod } from '../SubscriptionPeriod';
import { PlanSubscription } from '../models/PlanSubscription';
import { Inject, Injectable } from '@nestjs/common';
import { SystemKnexConnection } from '@/modules/System/SystemDB/SystemDB.constants';
import { Knex } from 'knex';
import { PartialModelObject } from 'objection';

@Injectable()
export class PlanSubscriptionRepository extends TenantRepository {
  constructor(
    @Inject(SystemKnexConnection)
    private readonly tenantDBKnex: Knex,
  ) {
    super();
  }

  /**
   * Gets the repository's model.
   */
  get model(): typeof PlanSubscription {
    return PlanSubscription.bindKnex(this.tenantDBKnex);
  }

  /**
   * Records a new subscription for the associated tenant.
   */
  newSubscription(
    tenantId: number,
    planId: number,
    invoiceInterval: 'month' | 'year',
    invoicePeriod: number,
    subscriptionSlug: string,
    payload?: { lemonSqueezyId?: string },
  ) {
    const period = new SubscriptionPeriod(invoiceInterval, invoicePeriod);
    const model: PartialModelObject<PlanSubscription> = {
      tenantId,
      slug: subscriptionSlug,
      planId,
      startsAt: period.getStartDate(),
      endsAt: period.getEndDate(),
      lemonSubscriptionId: payload?.lemonSqueezyId || null,
    };
    return this.model.query().insert({ ...model });
  }
}
