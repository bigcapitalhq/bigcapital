import path from 'path';
import { Model } from 'objection';
import BaseModel from '@/models/Model';

export default class Resource extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'resources';
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
    const View = require('@/models/View');
    const ResourceField = require('@/models/ResourceField');
    const Permission = require('@/models/Permission');

    return {
      /**
       * Resource model may has many views.
       */
      views: {
        relation: Model.HasManyRelation,
        modelClass: View.default,
        join: {
          from: 'resources.id',
          to: 'views.resourceId',
        },
      },

      /**
       * Resource model may has many fields.
       */
      fields: {
        relation: Model.HasManyRelation,
        modelClass: ResourceField.default,
        join: {
          from: 'resources.id',
          to: 'resource_fields.resourceId',
        },
      },

      /**
       * Resource model may has many associated permissions.
       */
      permissions: {
        relation: Model.ManyToManyRelation,
        modelClass: Permission.default,
        join: {
          from: 'resources.id',
          through: {
            from: 'role_has_permissions.resourceId',
            to: 'role_has_permissions.permissionId',
          },
          to: 'permissions.id',
        },
      },
    };
  }
}
