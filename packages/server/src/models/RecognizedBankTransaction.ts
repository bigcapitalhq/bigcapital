import TenantModel from 'models/TenantModel';

export class RecognizedBankTransaction extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'recognized_bank_transactions';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return [];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [];
  }
}
