import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { Account } from '@/modules/Accounts/models/Account.model';

export class BudgetEntry extends TenantBaseModel {
  id!: number;
  budgetId!: number;
  accountId!: number;
  date: Date | string;
  amount: number;

  account?: Account;

  createdAt?: Date;
  updatedAt?: Date;

  /**
   * Table name.
   */
  static get tableName() {
    return 'budget_entries';
  }

  /**
   * Model timestamps.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { Account } = require('../../Accounts/models/Account.model');
    const { Budget } = require('./Budget');

    return {
      /**
       * Budget entry belongs to budget.
       */
      budget: {
        relation: Model.BelongsToOneRelation,
        modelClass: Budget,
        join: {
          from: 'budget_entries.budgetId',
          to: 'budgets.id',
        },
      },

      /**
       * Budget entry belongs to account.
       */
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'budget_entries.accountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
