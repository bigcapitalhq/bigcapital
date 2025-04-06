import { Model, mixin } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

export class RolePermission extends TenantBaseModel {
  value: any;
  ability: any;
  subject: any;

  /**
   * Table name
   */
  static get tableName() {
    return 'role_permissions';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { Role } = require('./Role.model');

    return {
      /**
       * 
       */
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'role_permissions.roleId',
          to: 'roles.id',
        },
      },
    };
  }
}
