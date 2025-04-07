import { BaseModel } from '@/models/Model';

export class MatchedBankTransaction extends BaseModel {
  public referenceId!: number;
  public referenceType!: string;
  public uncategorizedTransactionId!: number;


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
