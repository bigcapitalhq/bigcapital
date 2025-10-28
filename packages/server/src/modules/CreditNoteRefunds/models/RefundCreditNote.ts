import { Model, mixin } from 'objection';
// import TenantModel from 'models/TenantModel';
// import ModelSetting from './ModelSetting';
// import CustomViewBaseModel from './CustomViewBaseModel';
// import ModelSearchable from './ModelSearchable';
import { BaseModel } from '@/models/Model';
import { CreditNote } from '@/modules/CreditNotes/models/CreditNote';

export class RefundCreditNote extends BaseModel {
  date: Date;
  referenceNo: string;
  amount: number;
  currencyCode: string;
  exchangeRate: number;
  fromAccountId: number;
  description: string;
  creditNoteId: number;

  userId?: number;
  branchId?: number;

  createdAt?: Date | null;

  creditNote!: CreditNote;

  /**
   * Table name.
   */
  static get tableName() {
    return 'refund_credit_note_transactions';
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
    const { Account } = require('../../Accounts/models/Account.model');
    const { CreditNote } = require('../../CreditNotes/models/CreditNote');

    return {
      fromAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'refund_credit_note_transactions.fromAccountId',
          to: 'accounts.id',
        },
      },
      creditNote: {
        relation: Model.BelongsToOneRelation,
        modelClass: CreditNote,
        join: {
          from: 'refund_credit_note_transactions.creditNoteId',
          to: 'credit_notes.id',
        },
      },
    };
  }
}
