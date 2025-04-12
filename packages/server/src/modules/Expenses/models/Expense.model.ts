import { Model, raw } from 'objection';
import * as moment from 'moment';
import { ExpenseCategory } from './ExpenseCategory.model';
import { Account } from '@/modules/Accounts/models/Account.model';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { ExportableModel } from '@/modules/Export/decorators/ExportableModel.decorator';
import { ImportableModel } from '@/modules/Import/decorators/Import.decorator';
import { InjectModelMeta } from '@/modules/Tenancy/TenancyModels/decorators/InjectModelMeta.decorator';
import { ExpenseMeta } from './Expense.meta';

@ExportableModel()
@ImportableModel()
@InjectModelMeta(ExpenseMeta)
export class Expense extends TenantBaseModel {
  totalAmount!: number;
  currencyCode!: string;
  exchangeRate!: number;
  description?: string;
  paymentAccountId!: number;
  peyeeId!: number;
  referenceNo!: string;
  publishedAt!: Date | null;
  userId!: number;
  paymentDate!: Date;
  payeeId!: number;
  landedCostAmount!: number;
  allocatedCostAmount!: number;
  invoicedAmount: number;
  branchId!: number;
  createdAt!: Date;

  categories!: ExpenseCategory[];
  paymentAccount!: Account;
  attachments!: Document[];

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
   * Detarmines whether the expense is published.
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
      // viewRolesBuilder(query, conditionals, expression) {
      //   viewRolesBuilder(conditionals, expression)(query);
      // },

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
    const { Account } = require('../../Accounts/models/Account.model');
    const { ExpenseCategory } = require('./ExpenseCategory.model');
    const { Document } = require('../../ChromiumlyTenancy/models/Document');
    const { Branch } = require('../../Branches/models/Branch.model');
    // const { MatchedBankTransaction } = require('models/MatchedBankTransaction');

    return {
      /**
       * Expense transaction may belongs to a payment account.
       */
      paymentAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'expenses_transactions.paymentAccountId',
          to: 'accounts.id',
        },
      },

      /**
       * Expense transaction may has many expense categories.
       */
      categories: {
        relation: Model.HasManyRelation,
        modelClass: ExpenseCategory,
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
        modelClass: Branch,
        join: {
          from: 'expenses_transactions.branchId',
          to: 'branches.id',
        },
      },

      /**
       * Expense transaction may has many attached attachments.
       */
      attachments: {
        relation: Model.ManyToManyRelation,
        modelClass: Document,
        join: {
          from: 'expenses_transactions.id',
          through: {
            from: 'document_links.modelId',
            to: 'document_links.documentId',
          },
          to: 'documents.id',
        },
        filter(query) {
          query.where('model_ref', 'Expense');
        },
      },

      // /**
      //  * Expense may belongs to matched bank transaction.
      //  */
      // matchedBankTransaction: {
      //   relation: Model.HasManyRelation,
      //   modelClass: MatchedBankTransaction,
      //   join: {
      //     from: 'expenses_transactions.id',
      //     to: 'matched_bank_transactions.referenceId',
      //   },
      //   filter(query) {
      //     query.where('reference_type', 'Expense');
      //   },
      // },
    };
  }

  // static get meta() {
  //   return ExpenseSettings;
  // }

  // /**
  //  * Retrieve the default custom views, roles and columns.
  //  */
  // static get defaultViews() {
  //   return DEFAULT_VIEWS;
  // }

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
