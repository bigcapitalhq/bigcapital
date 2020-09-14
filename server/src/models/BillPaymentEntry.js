import { mixin } from 'objection';
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
}
