import BaseModel from '@/models/Model';

export default class ViewColumn extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'view_has_columns';
  }

  /**
   * Timestamp columns.
   */
  static get hasTimestamps() {
    return false;
  }
}
