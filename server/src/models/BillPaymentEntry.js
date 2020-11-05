import { mixin, Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class BillPaymentEntry extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'bills_payments_entries';
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
    const Bill = require('models/Bill');

    return {
      bill: {
        relation: Model.BelongsToOneRelation,
        modelClass: Bill.default,
        join: {
          from: 'bills_payments_entries.billId',
          to: 'bills.id',
        },
      },
    };
  }
}
