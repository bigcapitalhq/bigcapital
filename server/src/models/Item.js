import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';
import {
  buildFilterQuery,
} from '@/lib/ViewRolesBuilder';

export default class Item extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'items';
  }

  /**
   * Model timestamps.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    const TABLE_NAME = Item.tableName;

    return {
      sortBy(query, columnSort, sortDirection) {
        query.orderBy(columnSort, sortDirection);
      },
      viewRolesBuilder(query, conditions, logicExpression) {
        buildFilterQuery(Item.tableName, conditions, logicExpression)(query);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Media = require('@/models/Media');
    const Account = require('@/models/Account');
    const ItemCategory = require('@/models/ItemCategory');

    return {
      /**
       * Item may belongs to cateogory model.
       */
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(ItemCategory.default),
        join: {
          from: 'items.categoryId',
          to: 'items_categories.id',
        },
      },

      costAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'items.costAccountId',
          to: 'accounts.id',
        },
      },

      sellAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'items.sellAccountId',
          to: 'accounts.id',
        },
      },

      inventoryAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Account.default),
        join: {
          from: 'items.inventoryAccountId',
          to: 'accounts.id',
        },
      },

      media: {
        relation: Model.ManyToManyRelation,
        modelClass: this.relationBindKnex(Media.default),
        join: {
          from: 'items.id',
          through: {
            from: 'media_links.model_id',
            to: 'media_links.media_id',
          },
          to: 'media.id',
        }
      },
    };
  }
}
