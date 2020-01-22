import BaseModel from '@/models/Model';

export default class Budget extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'budget_entries';
  }
}
