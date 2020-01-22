import { Model } from 'objection';
import path from 'path';
import BaseModel from '@/models/Model';

export default class ViewRole extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'view_roles';
  }

  /**
   * Timestamp columns.
   */
  static get hasTimestamps() {
    return false;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {
      /**
       * View role model may belongs to view model.
       */
      view: {
        relation: Model.BelongsToOneRelation,
        modelBase: path.join(__dirname, 'View'),
        join: {
          from: 'view_roles.view_id',
          to: 'views.id',
        },
      },
    };
  }
}
