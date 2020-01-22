import path from 'path';
import { Model } from 'objection';
import BaseModel from '@/models/Model';

export default class View extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'views';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {
      /**
       * View model belongs to resource model.
       */
      resource: {
        relation: Model.BelongsToOneRelation,
        modelBase: path.join(__dirname, 'Resource'),
        join: {
          from: 'views.resource_id',
          to: 'resources.id',
        },
      },

      /**
       * View model may has many columns.
       */
      // columns: {
      //   relation: Model.ManyToManyRelation,
      //   modelBase: path.join(__dirname, 'ResourceField'),
      //   join: {
      //     from: 'id',
      //     through: {
      //       from: 'view_has_columns.view_id',
      //       to: 'view_has_columns.field_id',
      //     },
      //     to: 'resource_fields.view_id',
      //   }
      // }

      /**
       * View model may has many view roles.
       */
      viewRoles: {
        relation: Model.HasManyRelation,
        modelBase: path.join(__dirname, 'ViewRole'),
        join: {
          from: 'views.id',
          to: 'view_id',
        },
      },
    };
  }

  // columns() {
  //   return this.belongsToMany('ResourceField', 'view_has_columns', 'view_id', 'field_id');
  // },

  // viewRoles() {
  //   return this.hasMany('ViewRole', 'view_id');
  // },
}
