import { Model } from 'objection';
import path from 'path';
import BaseModel from '@/models/Model';

export default class Permission extends BaseModel {
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
    return {
      /**
       * Permission model may belongs to role model.
       */
      role: {
        relation: Model.BelongsToOneRelation,
        modelBase: path.join(__dirname, 'Role'),
        join: {
          from: 'permissions.role_id',
          to: 'roles.id',
        },
      },

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
