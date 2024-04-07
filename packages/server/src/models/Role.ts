import TenantModel from 'models/TenantModel';
import { Model } from 'objection';

export default class Role extends TenantModel {
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
    const RolePermission = require('models/RolePermission');

    return {
      /**
       *
       */
      permissions: {
        relation: Model.HasManyRelation,
        modelClass: RolePermission.default,
        join: {
          from: 'roles.id',
          to: 'role_permissions.roleId',
        },
      },
    };
  }
}
