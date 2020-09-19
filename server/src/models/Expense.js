import { Model } from 'objection';
import TenantModel from 'models/TenantModel';
import { viewRolesBuilder } from 'lib/ViewRolesBuilder';

export default class Expense extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'expenses_transactions';
  }

  /**
   * Account transaction reference type.
   */
  static get referenceType() {
    return 'Expense';
  }

  /**
   * Model timestamps.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
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
    const Account = require('models/Account');
    const ExpenseCategory = require('models/ExpenseCategory');
    
    return {
      paymentAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'expenses_transactions.paymentAccountId',
          to: 'accounts.id',
        },
      },
      categories: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(ExpenseCategory.default),
        join: {
          from: 'expenses_transactions.id',
          to: 'expense_transaction_categories.expenseId',
        },
      },
    };
  }
}
