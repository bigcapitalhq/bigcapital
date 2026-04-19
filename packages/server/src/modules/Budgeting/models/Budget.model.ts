import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { InjectModelDefaultViews } from '@/modules/Views/decorators/InjectModelDefaultViews.decorator';
import { InjectModelMeta } from '@/modules/Tenancy/TenancyModels/decorators/InjectModelMeta.decorator';
import { BudgetMeta } from './Budget.meta';

@InjectModelMeta(BudgetMeta)
export class Budget extends TenantBaseModel {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budgetType: string;
  periodType: string;
  status: string;

  entries;

  createdAt: Date;
  updatedAt: Date;

  static get tableName() {
    return 'budgets';
  }

  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get virtualAttributes() {
    return ['isActive', 'isDraft', 'isClosed'];
  }

  get isActive() {
    return this.status === 'active';
  }

  get isDraft() {
    return this.status === 'draft';
  }

  get isClosed() {
    return this.status === 'closed';
  }

  static get resourceable() {
    return true;
  }

  static get modifiers() {
    return {
      filterByStatus(query, status) {
        if (status) {
          query.where('budgets.status', status);
        }
      },
      filterByType(query, budgetType) {
        if (budgetType) {
          query.where('budgets.budget_type', budgetType);
        }
      },
      filterByPeriod(query, periodType) {
        if (periodType) {
          query.where('budgets.period_type', periodType);
        }
      },
    };
  }

  static get relationMappings() {
    const { BudgetEntry } = require('./BudgetEntry.model');
    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: BudgetEntry,
        join: {
          from: 'budgets.id',
          to: 'budget_entries.budget_id',
        },
      },
    };
  }

  static get searchRoles() {
    return [
      { condition: 'or', fieldKey: 'name', comparator: 'contains' },
    ];
  }
}
