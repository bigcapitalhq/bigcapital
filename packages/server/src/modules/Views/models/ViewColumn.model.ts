import { BaseModel } from '@/models/Model';

export class ViewColumn extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'view_has_columns';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {};
  }
}
