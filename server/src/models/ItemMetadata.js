import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class ItemMetadata extends TenantModel {
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
    const Item = require('@/models/Item');

    return {
      /**
       * Item category may has many items.
       */
      items: {
        relation: Model.BelongsToOneRelation,
        modelBase: this.relationBindKnex(Item.default),
        join: {
          from: 'items_metadata.item_id',
          to: 'items.id',
        },
      },
    };
  }
}
