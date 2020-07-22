import { Model, mixin } from 'objection';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';

export default class SaleReceiptEntry extends mixin(TenantModel, [CachableModel]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'sales_receipt_entries';
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
    const SaleReceipt = require('@/models/SaleReceipt');

    return {
      saleReceipt: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(SaleReceipt.default),
        join: {
          from: 'sales_receipt_entries.sale_receipt_id',
          to: 'sales_receipts.id',
        },
      },
    };
  }
}
