import { Model } from 'objection';
import path from 'path';
import TenantModel from '@/models/TenantModel';

export default class Permission extends TenantModel {
  /**
   * Table name of Role model.
   * @type {String}
   */
  static get tableName() {
    return 'permissions';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Role = require('@/models/Role');

    return {
      /**
       * Permission model may belongs to role model.
       */
      // role: {
      //   relation: Model.BelongsToOneRelation,
      //   modelBase: path.join(__dirname, 'Role').bindKnex(this.knexBinded),
      //   join: {
      //     from: 'permissions.role_id',
      //     to: 'roles.id',
      //   },
      // },

      // resource: {
      //   relation: Model.BelongsToOneRelation,
      //   modelBase: path.join(__dirname, 'Resource'),
      //   join: {
      //     from: 'permissions.',
      //     to: '',
      //   }
      // }
    };
  }
}
