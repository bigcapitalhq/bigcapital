import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class View extends TenantModel {
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
        modelClass: this.relationBindKnex(Resource.default),
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
        modelClass: this.relationBindKnex(ViewColumn.default),
        join: {
          from: 'views.id',
          to: 'view_has_columns.viewId',
        },
      },

      /**
       * View model may has many view roles.
       */
      roles: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(ViewRole.default),
        join: {
          from: 'views.id',
          to: 'view_roles.viewId',
        },
      },
    };
  }
}
