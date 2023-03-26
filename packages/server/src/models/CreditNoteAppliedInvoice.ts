import { mixin, Model } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import CustomViewBaseModel from './CustomViewBaseModel';
import ModelSearchable from './ModelSearchable';

export default class CreditNoteAppliedInvoice extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'credit_note_applied_invoice';
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
    const SaleInvoice = require('models/SaleInvoice');
    const CreditNote = require('models/CreditNote');

    return {
      saleInvoice: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleInvoice.default,
        join: {
          from: 'credit_note_applied_invoice.invoiceId',
          to: 'sales_invoices.id',
        },
      },

      creditNote: {
        relation: Model.BelongsToOneRelation,
        modelClass: CreditNote.default,
        join: {
          from: 'credit_note_applied_invoice.creditNoteId',
          to: 'credit_notes.id',
        },
      },
    };
  }
}
