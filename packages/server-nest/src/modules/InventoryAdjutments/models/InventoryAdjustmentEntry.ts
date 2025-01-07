import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import { Item } from '@/modules/Items/models/Item';
// import TenantModel from 'models/TenantModel';

export class InventoryAdjustmentEntry extends BaseModel {
  adjustmentId!: number;
  index!: number;
  itemId!: number;
  quantity!: number;
  cost!: number;
  value!: number;

  item!: Item;

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
    const { InventoryAdjustment } = require('./InventoryAdjustment');
    const { Item } = require('../../Items/models/Item');

    return {
      inventoryAdjustment: {
        relation: Model.BelongsToOneRelation,
        modelClass: InventoryAdjustment,
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
        modelClass: Item,
        join: {
          from: 'inventory_adjustments_entries.itemId',
          to: 'items.id',
        },
      },
    };
  }
}
