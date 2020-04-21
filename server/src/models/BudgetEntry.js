import TenantModel from '@/models/TenantModel';

export default class Budget extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'budget_entries';
  }
}
