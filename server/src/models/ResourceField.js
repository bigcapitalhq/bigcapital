import { snakeCase } from 'lodash';
import { Model } from 'objection';
import path from 'path';
import BaseModel from '@/models/Model';

export default class ResourceField extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'resource_fields';
  }

  /**
   * Timestamp columns.
   */
  static get hasTimestamps() {
    return false;
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['key'];
  }

  /**
   * Resource field key.
   */
  key() {
    return snakeCase(this.labelName);
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {
      /**
       * Resource field may belongs to resource model.
       */
      resource: {
        relation: Model.BelongsToOneRelation,
        modelBase: path.join(__dirname, 'Resource'),
        join: {
          from: 'resource_fields.resource_id',
          to: 'resources.id',
        },
      },
    };
  }
}
