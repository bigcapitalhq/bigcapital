import { mixin, Model } from 'objection';
// import TenantModel from 'models/TenantModel';
// import ModelSetting from './ModelSetting';
// import CustomViewBaseModel from './CustomViewBaseModel';
// import ModelSearchable from './ModelSearchable';
import { BaseModel } from '@/models/Model';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { CreditNote } from '../../CreditNotes/models/CreditNote';

export class CreditNoteAppliedInvoice extends BaseModel {
  public amount: number;
  public creditNoteId: number;
  public invoiceId: number;

  public saleInvoice!: SaleInvoice;
  public creditNote!: CreditNote;

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
    const { SaleInvoice } = require('../../SaleInvoices/models/SaleInvoice');
    const { CreditNote } = require('../../CreditNotes/models/CreditNote');

    return {
      saleInvoice: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleInvoice,
        join: {
          from: 'credit_note_applied_invoice.invoiceId',
          to: 'sales_invoices.id',
        },
      },

      creditNote: {
        relation: Model.BelongsToOneRelation,
        modelClass: CreditNote,
        join: {
          from: 'credit_note_applied_invoice.creditNoteId',
          to: 'credit_notes.id',
        },
      },
    };
  }
}
