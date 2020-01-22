import { Model } from 'objection';
import BaseModel from '@/models/Model';

export default class AccountBalance extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'account_balances';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Account = require('@/models/Account');

    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'account_balance.account_id',
          to: 'accounts.id',
        },
      },
    };
  }
}
