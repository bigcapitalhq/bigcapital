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

  /**
   * Item category fields.
   */
  static get fields() {
    return {
      name: {
        label: 'Name',
        column: 'name',
        columnType: 'string'
      },
      description: {
        label: 'Description',
        column: 'description',
        columnType: 'string'
      },
      user: {
        label: 'User',
        column: 'user_id',
        relation: 'users.id',
        relationColumn: 'users.id',
      },
      cost_account: {
        label: 'Cost account',
        column: 'cost_account_id',
        relation: 'accounts.id',
        optionsResource: 'account'
      },
      sell_account: {
        label: 'Sell account',
        column: 'sell_account_id',
        relation: 'accounts.id',
        optionsResource: 'account'
      },
      inventory_account: {
        label: 'Inventory account',
        column: 'inventory_account_id',
        relation: 'accounts.id',
        optionsResource: 'account'
      },
      cost_method: {
        label: 'Cost method',
        column: 'cost_method',
        options: [{
          key: 'FIFO', label: 'First-in first-out (FIFO)',
          key: 'LIFO', label: 'Last-in first-out (LIFO)',
          key: 'average', label: 'Average rate',
        }],
        columnType: 'string',
      },
      created_at: {
        label: 'Created at',
        column: 'created_at',
        columnType: 'date',
      },
    };
  }
}
