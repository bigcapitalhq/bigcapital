import TenantModel from 'models/TenantModel';

export class MatchedBankTransaction extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'matched_bank_transactions';
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
