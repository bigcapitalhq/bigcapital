import TenantModel from 'models/TenantModel';
import { Model } from 'objection';

export class BankRule extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'bank_rules';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { BankRuleCondition } = require('models/BankRuleCondition');

    return {
      /**
       * Sale invoice associated entries.
       */
      conditions: {
        relation: Model.HasManyRelation,
        modelClass: BankRuleCondition,
        join: {
          from: 'bank_rules.id',
          to: 'bank_rule_conditions.ruleId',
        },
      },
    };
  }
}
