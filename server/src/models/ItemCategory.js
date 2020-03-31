import path from 'path';
import { Model } from 'objection';
import BaseModel from '@/models/Model';

export default class ItemCategory extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'items_categories';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Item = require('@/models/Item');

    return {
      /**
       * Item category may has many items.
       */
      items: {
        relation: Model.HasManyRelation,
        modelClass: Item.default,
        join: {
          from: 'items_categories.itemId',
          to: 'items.id',
        },
      },
    };
  }
}
