import { Model, mixin } from 'objection';
import SystemModel from '@/system/models/SystemModel';
import { PlanSubscription } from '..';

export default class Plan extends mixin(SystemModel) {
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
    const PlanSubscription = require('system/models/Subscriptions/PlanSubscription');

    return {
      /**
       * The plan may have many subscriptions.
       */
      subscriptions: {
        relation: Model.HasManyRelation,
        modelClass: PlanSubscription.default,
        join: {
          from: 'subscription_plans.id',
          to: 'subscription_plan_subscriptions.planId',
        },
      }
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
