import { BaseModel } from '@/models/Model';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { Model } from 'objection';

export class PaymentReceivedEntry extends BaseModel {
  paymentReceiveId: number;
  invoiceId: number;
  paymentAmount: number;
  index: number;

  invoice?: SaleInvoice;

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
    const { PaymentReceived } = require('./PaymentReceived');
    const { SaleInvoice } = require('../../SaleInvoices/models/SaleInvoice');

    return {
      /**
       */
      payment: {
        relation: Model.BelongsToOneRelation,
        modelClass: PaymentReceived,
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
        modelClass: SaleInvoice,
        join: {
          from: 'payment_receives_entries.invoiceId',
          to: 'sales_invoices.id',
        },
      },
    };
  }
}
