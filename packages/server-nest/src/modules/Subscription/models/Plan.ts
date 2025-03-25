import { SystemModel } from '@/modules/System/models/SystemModel';
import { Model, mixin } from 'objection';

export class Plan extends mixin(SystemModel) {
  public readonly slug: string;
  public readonly price: number;
  public readonly invoiceInternal: number;
  public readonly invoicePeriod: string;
  public readonly trialPeriod: string;
  public readonly trialInterval: number;

  /**
   * Table name.
   */
  static get tableName() {
    return 'subscription_plans';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Defined virtual attributes.
   */
  static get virtualAttributes() {
    return ['isFree', 'hasTrial'];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      getFeatureBySlug(builder, featureSlug) {
        builder.where('slug', featureSlug);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { PlanSubscription } = require('./PlanSubscription');

    return {
      /**
       * The plan may have many subscriptions.
       */
      subscriptions: {
        relation: Model.HasManyRelation,
        modelClass: PlanSubscription,
        join: {
          from: 'subscription_plans.id',
          to: 'subscription_plan_subscriptions.planId',
        },
      },
    };
  }

  /**
   * Check if plan is free.
   * @return {boolean}
   */
  isFree() {
    return this.price <= 0;
  }

  /**
   * Check if plan is paid.
   * @return {boolean}
   */
  isPaid() {
    return !this.isFree();
  }

  /**
   * Check if plan has trial.
   * @return {boolean}
   */
  hasTrial() {
    return this.trialPeriod && this.trialInterval;
  }
}
