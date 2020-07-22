import { Model, mixin } from 'objection';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';

export default class SaleEstimateEntry extends mixin(TenantModel, [CachableModel]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'sales_estimate_entries';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return [];
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
    const SaleEstimate = require('@/models/SaleEstimate');

    return {
      estimate: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(SaleEstimate.default),
        join: {
          from: 'sales_estimates.id',
          to: 'sales_estimate_entries.estimate_id',
        },
      },
    };
  }
}
