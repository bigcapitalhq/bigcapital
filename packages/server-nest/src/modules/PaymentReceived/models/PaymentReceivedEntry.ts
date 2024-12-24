import { BaseModel } from '@/models/Model';
import { Model, mixin } from 'objection';

export class PaymentReceivedEntry extends BaseModel {
  paymentReceiveId: number;
  invoiceId: number;
  paymentAmount: number;

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
      payment: {
        relation: Model.BelongsToOneRelation,
        modelClass: PaymentReceive.default,
        join: {
          from: 'payment_receives_entries.paymentReceiveId',
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
        },
      },
    };
  }
}
