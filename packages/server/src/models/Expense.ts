import { Model, mixin, raw } from 'objection';
import TenantModel from 'models/TenantModel';
import { viewRolesBuilder } from '@/lib/ViewRolesBuilder';
import ModelSetting from './ModelSetting';
import ExpenseSettings from './Expense.Settings';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from '@/services/Expenses/constants';
import ModelSearchable from './ModelSearchable';
import moment from 'moment';

export default class Expense extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
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

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [
      'isPublished',
      'unallocatedCostAmount',
      'localAmount',
      'localLandedCostAmount',
      'localUnallocatedCostAmount',
      'localAllocatedCostAmount',
      'billableAmount',
    ];
  }

  /**
   * Retrieves the local amount of expense.
   * @returns {number}
   */
  get localAmount() {
    return this.totalAmount * this.exchangeRate;
  }

  /**
   * Rertieves the local landed cost amount of expense.
   * @returns {number}
   */
  get localLandedCostAmount() {
    return this.landedCostAmount * this.exchangeRate;
  }

  /**
   * Retrieves the local allocated cost amount.
   * @returns {number}
   */
  get localAllocatedCostAmount() {
    return this.allocatedCostAmount * this.exchangeRate;
  }

  /**
   * Retrieve the unallocated cost amount.
   * @return {number}
   */
  get unallocatedCostAmount() {
    return Math.max(this.totalAmount - this.allocatedCostAmount, 0);
  }

  /**
   * Retrieves the local unallocated cost amount.
   * @returns {number}
   */
  get localUnallocatedCostAmount() {
    return this.unallocatedCostAmount * this.exchangeRate;
  }

  /**
   * Determines whether the expense is published.
   * @returns {boolean}
   */
  get isPublished() {
    return Boolean(this.publishedAt);
  }

  /**
   * Retrieves the calculated amount which have not been invoiced.
   */
  get billableAmount() {
    return Math.max(this.totalAmount - this.invoicedAmount, 0);
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

      filterByDraft(query) {
        query.where('published_at', null);
      },

      filterByPublished(query) {
        query.whereNot('published_at', null);
      },

      filterByStatus(query, status) {
        switch (status) {
          case 'draft':
            query.modify('filterByDraft');
            break;
          case 'published':
          default:
            query.modify('filterByPublished');
            break;
        }
      },

      publish(query) {
        query.update({
          publishedAt: moment().toMySqlDateTime(),
        });
      },

      /**
       * Filters the expenses have billable amount.
       */
      billable(query) {
        query.where(raw('AMOUNT > INVOICED_AMOUNT'));
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
    const Branch = require('models/Branch');

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
        filter: (query) => {
          query.orderBy('index', 'ASC');
        },
      },

      /**
       * Expense transction may belongs to a branch.
       */
      branch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Branch.default,
        join: {
          from: 'expenses_transactions.branchId',
          to: 'branches.id',
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
        filter(query) {
          query.where('model_name', 'Expense');
        },
      },
    };
  }

  static get meta() {
    return ExpenseSettings;
  }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  static get defaultViews() {
    return DEFAULT_VIEWS;
  }

  /**
   * Model search attributes.
   */
  static get searchRoles() {
    return [
      { fieldKey: 'reference_no', comparator: 'contains' },
      { condition: 'or', fieldKey: 'amount', comparator: 'equals' },
    ];
  }

  /**
   * Prevents mutate base currency since the model is not empty.
   */
  static get preventMutateBaseCurrency() {
    return true;
  }
}
