import { Model, mixin } from 'objection';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';

export default class View extends mixin(TenantModel, [CachableModel]) {
  /**
   * Table name.
   */
  static get tableName() {
    return 'views';
  }

  /**
   * Model timestamps.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Extend query builder model.
   */
  static get QueryBuilder() {
    return CachableQueryBuilder;
  }

  static get modifiers() {
    const TABLE_NAME = View.tableName;

    return {
      allMetadata(query) {
        query.withGraphFetched('roles.field');
        query.withGraphFetched('columns');
      },

      specificOrFavourite(query, viewId) {
        if (viewId) {
          query.where('id', viewId)
        }
        return query;
      }
    }
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
