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
    return {
      /**
       * Item category may has many items.
       */
      items: {
        relation: Model.HasManyRelation,
        modelBase: path.join(__dirname, 'Item'),
        join: {
          from: 'items_categories.item_id',
          to: 'items.id',
        },
      },
    };
  }
}
