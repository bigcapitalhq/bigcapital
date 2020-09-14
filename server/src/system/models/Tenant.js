import BaseModel from 'models/Model';
import { Model } from 'objection';
import SubscriptionPeriod from 'services/Subscription/SubscriptionPeriod';

export default class Tenant extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'tenants';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Query modifiers.
   */
  static modifiers() {
    return {
      subscriptions(builder) {
        builder.withGraphFetched('subscriptions');
      },
    };
  }

  /**
   * Relations mappings.
   */
  static get relationMappings() {
    const PlanSubscription = require('./Subscriptions/PlanSubscription');

    return {
      subscriptions: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(PlanSubscription.default),
        join: {
          from: 'tenants.id',
          to: 'subscription_plan_subscriptions.tenantId',
        }
      },
    }
  }

  /**
   * Retrieve the subscribed plans ids.
   * @return {number[]}
   */
  async subscribedPlansIds() {
    const { subscriptions } = this;
    return chain(subscriptions).map('planId').unq();
  }

  /**
   * Records a new subscription for the associated tenant.
   * @param {string} subscriptionSlug 
   * @param {IPlan} plan 
   */
  newSubscription(subscriptionSlug, plan) {
    const trial = new SubscriptionPeriod(plan.trialInterval, plan.trialPeriod)
    const period = new SubscriptionPeriod(plan.invoiceInterval, plan.invoicePeriod, trial.getEndDate());

    return this.$relatedQuery('subscriptions').insert({
      slug: subscriptionSlug,
      planId: plan.id,

      trialStartedAt: trial.getStartDate(),
      trialEndsAt: trial.getEndDate(),

      startsAt: period.getStartDate(),
      endsAt: period.getEndDate(),
    });
  }
}
