import { Model, mixin } from 'objection';
import moment from 'moment';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';

export default class SaleInvoiceEntry extends mixin(TenantModel, [CachableModel]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'sales_invoices_entries';
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
    const SaleInvoice = require('@/models/SaleInvoice');

    return {
      saleInvoice: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(SaleInvoice.default),
        join: {
          from: 'sales_invoices_entries.sale_invoice_id',
          to: 'sales_invoices.id',
        },
      },
    };
  }
}
