import { Model, mixin } from 'objection';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';

export default class PaymentReceiveEntry extends mixin(TenantModel, [CachableModel]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'payment_receives_entries';
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
    const PaymentReceive = require('@/models/PaymentReceive');
    const SaleInvoice = require('@/models/SaleInvoice');

    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(PaymentReceive.default),
        join: {
          from: 'payment_receives_entries.payment_receive_id',
          to: 'payment_receives.id',
        },
      },

      invoice: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(SaleInvoice.default),
        join: {
          from: 'payment_receives_entries.invoiceId',
          to: 'sales_invoices.id',
        }
      }
    };
  }
}
