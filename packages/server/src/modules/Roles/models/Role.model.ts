import { Model, mixin } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { RolePermission } from './RolePermission.model';

export class Role extends TenantBaseModel {
  name: string;
  description: string;
  slug: string;
  predefined: boolean;
  permissions: Array<RolePermission>;

  /**
   * Table name
   */
  static get tableName() {
    return 'roles';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { RolePermission } = require('./RolePermission.model');

    return {
      /**
       *
       */
      permissions: {
        relation: Model.HasManyRelation,
        modelClass: RolePermission,
        join: {
          from: 'roles.id',
          to: 'role_permissions.roleId',
        },
      },
    };
  }
}
