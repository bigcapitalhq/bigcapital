import { Model } from 'objection';
import path from 'path';
import BaseModel from '@/models/Model';

export default class Item extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'items';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
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
        modelBase: path.join(__dirname, 'ItemCategory'),
        join: {
          from: 'items.categoryId',
          to: 'items_categories.id',
        },
      },
    };
  }
}
