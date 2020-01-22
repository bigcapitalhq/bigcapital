import path from 'path';
import { Model } from 'objection';
import BaseModel from '@/models/Model';

export default class ItemMetadata extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'items_metadata';
  }

  /**
   * Timestamp columns.
   */
  static get hasTimestamps() {
    return ['created_at', 'updated_at'];
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
        relation: Model.BelongsToOneRelation,
        modelBase: path.join(__dirname, 'Item'),
        join: {
          from: 'items_metadata.item_id',
          to: 'items.id',
        },
      },
    };
  }
}
