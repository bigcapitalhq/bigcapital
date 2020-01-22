/* eslint-disable global-require */
import { Model } from 'objection';
import { flatten } from 'lodash';
import BaseModel from '@/models/Model';

export default class Account extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'accounts';
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      filterAccountTypes(query, typesIds) {
        if (typesIds.length > 0) {
          query.whereIn('accoun_type_id', typesIds);
        }
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const AccountType = require('@/models/AccountType');
    const AccountBalance = require('@/models/AccountBalance');
    const AccountTransaction = require('@/models/AccountTransaction');

    return {
      /**
       * Account model may belongs to account type.
       */
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: AccountType.default,
        join: {
          from: 'accounts.accountTypeId',
          to: 'account_types.id',
        },
      },

      /**
       * Account model may has many balances accounts.
       */
      balance: {
        relation: Model.HasOneRelation,
        modelClass: AccountBalance.default,
        join: {
          from: 'accounts.id',
          to: 'account_balances.accountId',
        },
      },

      /**
       * Account model may has many transactions.
       */
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'accounts.id',
          to: 'accounts_transactions.accountId',
        },
      },
    };
  }

  static collectJournalEntries(accounts) {
    return flatten(accounts.map((account) => account.transactions.map((transaction) => ({
      accountId: account.id,
      ...transaction,
      accountNormal: account.type.normal,
    }))));
  }
}
