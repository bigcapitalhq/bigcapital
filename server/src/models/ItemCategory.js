import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import ItemCategorySettings from './ItemCategory.Settings';

export default class ItemCategory extends mixin(TenantModel, [ModelSetting]) {
  /**
   * Table name.
   */
  static get tableName() {
    return 'items_categories';
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
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Inactive/Active mode.
       */
      sortByCount(query, order = 'asc') {
        query.orderBy('count', order);
      },
    };
  }

  /**
   * Model meta.
   */
  static get meta() {
    return ItemCategorySettings;
  }
}
