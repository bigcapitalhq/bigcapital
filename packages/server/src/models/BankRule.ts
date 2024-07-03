import TenantModel from 'models/TenantModel';
import { Model } from 'objection';

export class BankRule extends TenantModel {
  id!: number;
  name!: string;
  order!: number;
  applyIfAccountId!: number;
  applyIfTransactionType!: string;
  assignCategory!: string;
  assignAccountId!: number;
  assignPayee!: string;
  assignMemo!: string;
  conditionsType!: string;

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
    const Account = require('models/Account');

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

      /**
       * Bank rule may associated to the assign account.
       */
      assignAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'bank_rules.assignAccountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
