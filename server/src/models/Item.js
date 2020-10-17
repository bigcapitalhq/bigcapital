import { Model } from 'objection';
import TenantModel from 'models/TenantModel';
import {
  buildFilterQuery,
} from 'lib/ViewRolesBuilder';

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
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Allows to mark model as resourceable to viewable and filterable.
   */
  static get resourceable() {
    return true;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
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
    const Media = require('models/Media');
    const Account = require('models/Account');
    const ItemCategory = require('models/ItemCategory');

    return {
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

      media: {
        relation: Model.ManyToManyRelation,
        modelClass: Media.default,
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


  static get fields() {
    return {
      type: {
        column: 'type',
      },
      name: {
        column: 'name',
      },
      sellable: {
        column: 'sellable',
      },
      purchasable: {
        column: 'purchasable',
      },
      sell_price: {
        column: 'sell_price'
      },
      cost_price: {
        column: 'cost_price',
      },
      currency_code: {
        column: 'currency_code',
      },
      cost_account: {
        column: 'cost_account_id',
        relation: 'accounts.id',
      },
      sell_account: {
        column: 'sell_account_id',
        relation: 'accounts.id',
      },
      inventory_account: {
        column: 'inventory_account_id',
        relation: 'accounts.id',
      },
      sell_description: {
        column: 'sell_description',
      },
      purchase_description: {
        column: 'purchase_description',
      },
      quantity_on_hand: {
        column: 'quantity_on_hand',
      },
      note: {
        column: 'note',
      },
      category: {
        column: 'category_id',
        relation: 'categories.id',
      },
      user: {
        column: 'user_id',
        relation: 'users.id',
        relationColumn: 'users.id',
      },
      created_at: {
        column: 'created_at',
      }
    };
  }
}
