import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class InventoryAdjustmentEntry extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'inventory_adjustments_entries';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const InventoryAdjustment = require('models/InventoryAdjustment');
    const Item = require('models/Item');

    return {
      inventoryAdjustment: {
        relation: Model.BelongsToOneRelation,
        modelClass: InventoryAdjustment.default,
        join: {
          from: 'inventory_adjustments_entries.adjustmentId',
          to: 'inventory_adjustments.id',
        },
      },

      /**
       * Entry item.
       */
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item.default,
        join: {
          from: 'inventory_adjustments_entries.itemId',
          to: 'items.id',
        },
      },
    };
  }
}
