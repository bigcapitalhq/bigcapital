import TenantModel from 'models/TenantModel';

export class BankRuleCondition extends TenantModel {
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
