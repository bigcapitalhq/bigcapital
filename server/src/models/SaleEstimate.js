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
    const Customer = require('@/models/Customer');

    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Customer.default),
        join: {
          from: 'sales_estimates.customerId',
          to: 'customers.id',
        },
      },

      entries: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(ItemEntry.default),
        join: {
          from: 'sales_estimates.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'SaleEstimate');
        },
      },
    };
  }
}
