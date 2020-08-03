import { Model, mixin } from 'objection';
import moment from 'moment';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';

export default class SaleReceipt extends mixin(TenantModel, [CachableModel]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'sales_receipts';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const ItemEntry = require('@/models/ItemEntry');

    return {
      entries: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(ItemEntry.default),
        join: {
          from: 'sales_receipts.id',
          to: 'items_entries.referenceId',
        },
      },
    };
  }
}
