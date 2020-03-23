/* eslint-disable global-require */
import { Model } from 'objection';
import { flatten } from 'lodash';
import BaseModel from '@/models/Model';
import {
  buildFilterQuery,
} from '@/lib/ViewRolesBuilder';
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
    const TABLE_NAME = Account.tableName;

    return {
      filterAccounts(query, accountIds) {
        if (accountIds.length > 0) {
          query.whereIn(`${TABLE_NAME}.id`, accountIds);
        }
      },
      filterAccountTypes(query, typesIds) {
        if (typesIds.length > 0) {
          query.whereIn('account_types.accoun_type_id', typesIds);
        }
      },
      viewRolesBuilder(query, conditionals, expression) {
        buildFilterQuery(Account.tableName, conditionals, expression)(query);
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
