// import path from 'path';
import { Model } from 'objection';
import BaseModel from '@/models/Model';

export default class AccountType extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'account_types';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Account = require('@/models/Account');

    return {
      /**
       * Account type may has many associated accounts.
       */
      accounts: {
        relation: Model.HasManyRelation,
        modelClass: Account.default,
        join: {
          from: 'account_types.id',
          to: 'accounts.accountTypeId',
        },
      },
    };
  }
}
