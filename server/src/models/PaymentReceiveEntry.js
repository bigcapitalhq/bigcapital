import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';

export default class PaymentReceiveEntry extends TenantModel {
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
   * Relationship mapping.
   */
  static get relationMappings() {
    const PaymentReceive = require('models/PaymentReceive');
    const SaleInvoice = require('models/SaleInvoice');

    return {
      /**
       */
      entries: {
        relation: Model.HasManyRelation,
        modelClass: PaymentReceive.default,
        join: {
          from: 'payment_receives_entries.payment_receive_id',
          to: 'payment_receives.id',
        },
      },

      /**
       * The payment receive entry have have sale invoice.
       */
      invoice: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleInvoice.default,
        join: {
          from: 'payment_receives_entries.invoiceId',
          to: 'sales_invoices.id',
        }
      }
    };
  }
}
