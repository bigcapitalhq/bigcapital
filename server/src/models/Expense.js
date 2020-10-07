import { Model } from 'objection';
import TenantModel from 'models/TenantModel';
import { viewRolesBuilder } from 'lib/ViewRolesBuilder';
import Media from './Media';

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
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }


  static get media () {
    return true;
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
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Account = require('models/Account');
    const ExpenseCategory = require('models/ExpenseCategory');
    const Media = require('models/Media');

    return {
      paymentAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'expenses_transactions.paymentAccountId',
          to: 'accounts.id',
        },
      },
      categories: {
        relation: Model.HasManyRelation,
        modelClass: ExpenseCategory.default,
        join: {
          from: 'expenses_transactions.id',
          to: 'expense_transaction_categories.expenseId',
        },
      },
      media: {
        relation: Model.ManyToManyRelation,
        modelClass: Media.default,
        join: {
          from: 'expenses_transactions.id',
          through: {
            from: 'media_links.model_id',
            to: 'media_links.media_id',
          },
          to: 'media.id',
        },
      },
    };
  }

  /**
   * Model defined fields.
   */
  static get fields() {
    return {
      payment_date: {
        column: 'payment_date',
      },
      payment_account: {
        column: 'payment_account_id',
        relation: 'accounts.id',
      },
      amount: {
        column: 'total_amount',
      },
      currency_code: {
        column: 'currency_code',
      },
      reference_no: {
        column: 'reference_no'
      },
      description: {
        column: 'description',
      },
      published: {
        column: 'published',
      },
      user: {
        column: 'user_id',
        relation: 'users.id',
        relationColumn: 'users.id',
      },
      created_at: {
        column: 'created_at',
      },
    };
  }
}
