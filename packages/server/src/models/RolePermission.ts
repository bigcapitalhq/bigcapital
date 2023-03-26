import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import CustomViewBaseModel from './CustomViewBaseModel';
import ModelSearchable from './ModelSearchable';

export default class RolePermission extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
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
    const Role = require('models/Role');

    return {
      /**
       * 
       */
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role.default,
        join: {
          from: 'role_permissions.roleId',
          to: 'roles.id',
        },
      },
    };
  }
}
