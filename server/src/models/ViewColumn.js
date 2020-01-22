import BaseModel from '@/models/Model';

export default class ViewColumn extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'view_columns';
  }

  /**
   * Timestamp columns.
   */
  static get hasTimestamps() {
    return false;
  }
}
