import path from 'path';
import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class ItemCategory extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'items_categories';
  }

  static get resourceable() {
    return true;
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Item = require('models/Item');

    return {
      /**
       * Item category may has many items.
       */
      items: {
        relation: Model.HasManyRelation,
        modelClass: Item.default,
        join: {
          from: 'items_categories.id',
          to: 'items.categoryId',
        },
      },
    };
  }

  static get fields() {
    return {
      name: {
        column: 'name',
      },
      description: {
        column: 'description',
      },
      parent_category_id: {
        column: 'parent_category_id',
        relation: 'items_categories.id',
        relationColumn: 'items_categories.id',
      },
      user: {
        column: 'user_id',
        relation: 'users.id',
        relationColumn: 'users.id',
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
      cost_method: {
        column: 'cost_method',
      },
      created_at: {
        column: 'created_at',
      },
    };
  }
}
