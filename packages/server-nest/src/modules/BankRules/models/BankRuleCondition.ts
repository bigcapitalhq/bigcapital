import { BaseModel } from '@/models/Model';

export class BankRuleCondition extends BaseModel {
  public id!: number;
  public bankRuleId!: number;
  public field!: string;
  public comparator!: string;
  public value!: string;

  /**
   * Table name.
   */
  static get tableName() {
    return 'bank_rule_conditions';
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
