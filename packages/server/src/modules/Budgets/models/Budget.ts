import { Model } from 'objection';
import { BudgetEntry } from './BudgetEntry';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { InjectModelMeta } from '@/modules/Tenancy/TenancyModels/decorators/InjectModelMeta.decorator';
import { BudgetMeta } from './Budget.meta';

@InjectModelMeta(BudgetMeta)
export class Budget extends TenantBaseModel {
  id!: number;
  name!: string;
  description?: string;
  fromDate: Date | string;
  toDate: Date | string;

  createdAt?: Date;
  updatedAt?: Date;

  entries!: BudgetEntry[];

  /**
   * Table name.
   */
  static get tableName() {
    return 'budgets';
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
    const { BudgetEntry } = require('./BudgetEntry');

    return {
      /**
       * Budget may has many entries.
       */
      entries: {
        relation: Model.HasManyRelation,
        modelClass: BudgetEntry,
        join: {
          from: 'budgets.id',
          to: 'budget_entries.budgetId',
        },
        filter(query) {
          query.orderBy('date', 'ASC');
        },
      },
    };
  }

  /**
   * Model search attributes.
   */
  static get searchRoles() {
    return [{ fieldKey: 'name', comparator: 'contains' }];
  }
}
