import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class SaleReceiptEntry extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'sales_receipt_entries';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const SaleReceipt = require('models/SaleReceipt');

    return {
      saleReceipt: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleReceipt.default,
        join: {
          from: 'sales_receipt_entries.sale_receipt_id',
          to: 'sales_receipts.id',
        },
      },
    };
  }
}
