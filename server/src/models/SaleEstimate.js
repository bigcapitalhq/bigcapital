import { Model, mixin } from 'objection';
import moment from 'moment';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';


export default class SaleEstimate extends mixin(TenantModel, [CachableModel]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'sales_estimates';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Extend query builder model.
   */
  static get QueryBuilder() {
    return CachableQueryBuilder;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const SaleEstimateEntry = require('@/models/SaleEstimateEntry');

    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(SaleEstimateEntry.default),
        join: {
          from: 'sales_estimates.id',
          to: 'sales_estimate_entries.id',
        },
      },
    };
  }
}
