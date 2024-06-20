import TenantModel from 'models/TenantModel';
import { Model } from 'objection';

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
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {};
  }
}
