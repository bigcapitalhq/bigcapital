import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class InventoryCostLotTracker extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'inventory_cost_lot_tracker';
  }

  /**
   * Model timestamps.
   */
  static get timestamps() {
    return [];
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
          from: 'inventory_cost_lot_tracker.itemId',
          to: 'items.id',
        },
      },
    };
  }
}
