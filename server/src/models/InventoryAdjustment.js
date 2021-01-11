import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class InventoryAdjustment extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'inventory_adjustments';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['inventoryDirection', 'isPublished'];
  }

  /**
   * Retrieve formatted reference type.
   */
  get inventoryDirection() {
    return InventoryAdjustment.getInventoryDirection(this.type);
  }

  /**
   * Detarmines whether the adjustment is published.
   * @return {boolean}
   */
  get isPublished() {
    return !!this.publishedAt;
  }

  static getInventoryDirection(type) {
    const directions = {
      'increment': 'IN',
      'decrement': 'OUT',
    };
    return directions[type] || '';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const InventoryAdjustmentEntry = require('models/InventoryAdjustmentEntry');
    const Account = require('models/Account');

    return {
      /**
       * Adjustment entries.
       */
      entries: {
        relation: Model.HasManyRelation,
        modelClass: InventoryAdjustmentEntry.default,
        join: {
          from: 'inventory_adjustments.id',
          to: 'inventory_adjustments_entries.adjustmentId',
        },
      },

      /**
       * Inventory adjustment account.
       */
      adjustmentAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'inventory_adjustments.adjustmentAccountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
