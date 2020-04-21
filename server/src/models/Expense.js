import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';
import { viewRolesBuilder } from '@/lib/ViewRolesBuilder';

export default class Expense extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'expenses';
  }

  static get referenceType() {
    return 'Expense';
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      filterByDateRange(query, startDate, endDate) {
        if (startDate) {
          query.where('date', '>=', startDate);
        }
        if (endDate) {
          query.where('date', '<=', endDate);
        }
      },
      filterByAmountRange(query, from, to) {
        if (from) {
          query.where('amount', '>=', from);
        }
        if (to) {
          query.where('amount', '<=', to);
        }
      },
      filterByExpenseAccount(query, accountId) {
        if (accountId) {
          query.where('expense_account_id', accountId);
        }
      },
      filterByPaymentAccount(query, accountId) {
        if (accountId) {
          query.where('payment_account_id', accountId);
        }
      },

      viewRolesBuilder(query, conditionals, expression) {
        viewRolesBuilder(conditionals, expression)(query);
      },

      orderBy(query) {
        
      }
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Account = require('@/models/Account');
    const User = require('@/models/TenantUser');
    
    return {
      paymentAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'expenses.paymentAccountId',
          to: 'accounts.id',
        },
      },

      expenseAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'expenses.expenseAccountId',
          to: 'accounts.id',
        },
      },

      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(User.default),
        join: {
          from: 'expenses.userId',
          to: 'users.id',
        },
      },
    };
  }
}
