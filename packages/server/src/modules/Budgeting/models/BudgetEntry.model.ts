import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import { Account } from '@/modules/Accounts/models/Account.model';

export class BudgetEntry extends BaseModel {
  budgetId: number;
  accountId: number;
  amount: number;
  periodDate: string;

  account?: Account;

  createdAt: Date;
  updatedAt: Date;

  static get tableName() {
    return 'budget_entries';
  }

  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get relationMappings() {
    const { Account } = require('@/modules/Accounts/models/Account.model');
    const { Budget } = require('./Budget.model');

    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'budget_entries.account_id',
          to: 'accounts.id',
        },
      },
      budget: {
        relation: Model.BelongsToOneRelation,
        modelClass: Budget,
        join: {
          from: 'budget_entries.budget_id',
          to: 'budgets.id',
        },
      },
    };
  }
}
