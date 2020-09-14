// import path from 'path';
import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';

export default class AccountType extends TenantModel {
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
    const Account = require('models/Account');

    return {
      /**
       * Account type may has many associated accounts.
       */
      accounts: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'account_types.id',
          to: 'accounts.accountTypeId',
        },
      },
    };
  }
}
