import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class ViewColumn extends TenantModel {
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
    const ResourceField = require('@/models/ResourceField');

    return {
      /**
       * View role model may belongs to resource field model.
       */
      field: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(ResourceField.default),
        join: {
          from: 'view_has_columns.fieldId',
          to: 'resource_fields.id',
        },
      },
    };
  }
}
