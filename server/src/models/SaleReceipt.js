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
   * Extend query builder model.
   */
  static get QueryBuilder() {
    return CachableQueryBuilder;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const SaleReceiptEntry = require('@/models/SaleReceiptEntry');

    return {
      entries: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(SaleReceiptEntry.default),
        join: {
          from: 'sales_receipts.id',
          to: 'sales_receipt_entries.sale_receipt_id',
        },
      },
    };
  }
}
