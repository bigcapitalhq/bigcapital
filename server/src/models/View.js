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
    const Resource = require('@/models/Resource');
    const ViewColumn = require('@/models/ViewColumn');
    const ViewRole = require('@/models/ViewRole');

    return {
      /**
       * View model belongs to resource model.
       */
      resource: {
        relation: Model.BelongsToOneRelation,
        modelClass: Resource.default,
        join: {
          from: 'views.resourceId',
          to: 'resources.id',
        },
      },

      /**
       * View model may has many columns.
       */
      columns: {
        relation: Model.HasManyRelation,
        modelClass: ViewColumn.default,
        join: {
          from: 'views.id',
          to: 'view_has_columns.view_id',
        },
      },

      /**
       * View model may has many view roles.
       */
      viewRoles: {
        relation: Model.HasManyRelation,
        modelClass: ViewRole.default,
        join: {
          from: 'views.id',
          to: 'view_roles.view_id',
        },
      },
    };
  }
}
