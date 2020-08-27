import { Model, mixin } from 'objection';
import SystemModel from '@/system/models/SystemModel';

export default class PlanFeature extends mixin(SystemModel) {
  /**
   * Table name.
   */
  static get tableName() {
    return 'subscriptions.plan_features';
  }

  /**
   * Timestamps columns.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Plan = require('@/system/models/Subscriptions/Plan');

    return {
      plan: {
        relation: Model.BelongsToOneRelation,
        modelClass: Plan.default,
        join: {
          from: 'subscriptions.plan_features.planId',
          to: 'subscriptions.plans.id',
        },
      },
    };
  }
}
