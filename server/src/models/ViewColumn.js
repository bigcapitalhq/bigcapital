import { Model } from 'objection';
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


  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const ResourceField = require('@/models/ResourceField');

    return {
      /**
       * View role model may belongs to resource field model.
       */
      field: {
        relation: Model.BelongsToOneRelation,
        modelClass: ResourceField.default,
        join: {
          from: 'view_columns.fieldId',
          to: 'resource_fields.id',
        },
      },
    };
  }
}
