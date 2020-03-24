import { Model } from 'objection';
import path from 'path';
import BaseModel from '@/models/Model';
import {
  buildFilterQuery,
} from '@/lib/ViewRolesBuilder';

export default class Item extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'items';
  }

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
    const Account = require('@/models/Account');
    const ItemCategory = require('@/models/ItemCategory');

    return {
      /**
       * Item may has many meta data.
       */
      metadata: {
        relation: Model.HasManyRelation,
        modelBase: path.join(__dirname, 'ItemMetadata'),
        join: {
          from: 'items.id',
          to: 'items_metadata.item_id',
        },
      },

      /**
       * Item may belongs to cateogory model.
       */
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemCategory.default,
        join: {
          from: 'items.categoryId',
          to: 'items_categories.id',
        },
      },

      costAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'items.costAccountId',
          to: 'accounts.id',
        },
      },

      sellAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'items.sellAccountId',
          to: 'accounts.id',
        },
      },

      inventoryAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'items.inventoryAccountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
