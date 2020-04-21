import { snakeCase } from 'lodash';
import { Model } from 'objection';
import path from 'path';
import TenantModel from '@/models/TenantModel';

export default class ResourceField extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'resource_fields';
  }

  static get jsonAttributes() {
    return ['options'];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      whereNotPredefined(query) {
        query.whereNot('predefined', true);
      },
    };
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
    const Resource = require('@/models/Resource');

    return {
      /**
       * Resource field may belongs to resource model.
       */
      resource: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Resource.default),
        join: {
          from: 'resource_fields.resourceId',
          to: 'resources.id',
        },
      },
    };
  }
}
