import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class SaleInvoiceEntry extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'sales_invoices_entries';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const SaleInvoice = require('models/SaleInvoice');

    return {
      saleInvoice: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleInvoice.default,
        join: {
          from: 'sales_invoices_entries.sale_invoice_id',
          to: 'sales_invoices.id',
        },
      },
    };
  }
}
