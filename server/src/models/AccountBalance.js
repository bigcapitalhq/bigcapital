import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class AccountBalance extends TenantModel {
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
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'account_balances.account_id',
          to: 'accounts.id',
        },
      },
    };
  }
}
