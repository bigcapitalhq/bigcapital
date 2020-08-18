import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class InventoryTransaction extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'inventory_transactions';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Item = require('@/models/Item');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Item.default),
        join: {
          from: 'inventory_transactions.itemId',
          to: 'items.id',
        },
      },
    };
  }
}
