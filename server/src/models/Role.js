import { Model } from 'objection';
import BaseModel from '@/models/Model';

export default class Role extends BaseModel {
  /**
   * Table name of Role model.
   * @type {String}
   */
  static get tableName() {
    return 'roles';
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
    const Permission = require('@/models/Permission');
    const Resource = require('@/models/Resource');
    const User = require('@/models/User');
    const ResourceField = require('@/models/ResourceField');

    return {
      /**
       * Role may has many permissions.
       */
      permissions: {
        relation: Model.ManyToManyRelation,
        modelClass: Permission.default,
        join: {
          from: 'roles.id',
          through: {
            from: 'role_has_permissions.roleId',
            to: 'role_has_permissions.permissionId',
          },
          to: 'permissions.id',
        },
      },

      /**
       * Role may has many resources.
       */
      resources: {
        relation: Model.ManyToManyRelation,
        modelClass: Resource.default,
        join: {
          from: 'roles.id',
          through: {
            from: 'role_has_permissions.roleId',
            to: 'role_has_permissions.resourceId',
          },
          to: 'resources.id',
        },
      },

      /**
       * Role may has resource field.
       */
      field: {
        relation: Model.BelongsToOneRelation,
        modelClass: ResourceField.default,
        join: {
          from: 'roles.fieldId',
          to: 'resource_fields.id',
        }
      },

      /**
       * Role may has many associated users.
       */
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User.default,
        join: {
          from: 'roles.id',
          through: {
            from: 'user_has_roles.roleId',
            to: 'user_has_roles.userId',
          },
          to: 'users.id',
        },
      },
    };
  }
}
