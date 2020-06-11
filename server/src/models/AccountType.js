// import path from 'path';
import { Model, mixin } from 'objection';
import TenantModel from '@/models/TenantModel';
import CachableModel from '@/lib/Cachable/CachableModel';

export default class AccountType extends mixin(TenantModel, [CachableModel]) {
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
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'account_types.id',
          to: 'accounts.accountTypeId',
        },
      },
    };
  }
}
