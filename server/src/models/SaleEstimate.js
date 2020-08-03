import { Model, mixin } from 'objection';
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
   * Relationship mapping.
   */
  static get relationMappings() {
    const ItemEntry = require('@/models/ItemEntry');

    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(ItemEntry.default),
        join: {
          from: 'sales_estimates.id',
          to: 'items_entries.referenceId',
        },
      },
    };
  }
}
