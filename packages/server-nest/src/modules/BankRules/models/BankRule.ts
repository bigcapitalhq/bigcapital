import { BaseModel } from '@/models/Model';
import { Model } from 'objection';
import { BankRuleCondition } from './BankRuleCondition';
import { BankRuleAssignCategory, BankRuleConditionType } from '../types';

export class BankRule extends BaseModel {
  public id!: number;
  public name!: string;
  public order!: number;
  public applyIfAccountId!: number;
  public applyIfTransactionType!: string;
  public assignCategory!: BankRuleAssignCategory;
  public assignAccountId!: number;
  public assignPayee!: string;
  public assignMemo!: string;
  public conditionsType!: BankRuleConditionType;

  conditions!: BankRuleCondition[];

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
    const { BankRuleCondition } = require('./BankRuleCondition');
    const { Account } = require('../../Accounts/models/Account.model');

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
        modelClass: Account,
        join: {
          from: 'bank_rules.assignAccountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
