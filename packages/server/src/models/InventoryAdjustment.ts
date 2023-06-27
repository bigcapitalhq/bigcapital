import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import InventoryAdjustmentSettings from './InventoryAdjustment.Settings';
import ModelSetting from './ModelSetting';

export default class InventoryAdjustment extends mixin(TenantModel, [
  ModelSetting,
]) {
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
    return ['formattedType', 'inventoryDirection', 'isPublished'];
  }

  /**
   * Retrieve formatted adjustment type. 
   */
  get formattedType() {
    return InventoryAdjustment.getFormattedType(this.type);
  }

  /**
   * Retrieve formatted reference type.
   */
  get inventoryDirection() {
    return InventoryAdjustment.getInventoryDirection(this.type);
  }

  /**
   * Determines whether the adjustment is published.
   * @return {boolean}
   */
  get isPublished() {
    return !!this.publishedAt;
  }

  static getInventoryDirection(type) {
    const directions = {
      increment: 'IN',
      decrement: 'OUT',
    };
    return directions[type] || '';
  }

  /**
   * Retrieve the formatted adjustment type of the given type.
   * @param {string} type
   * @returns {string}
   */
  static getFormattedType(type) {
    const types = {
      increment: 'inventory_adjustment.type.increment',
      decrement: 'inventory_adjustment.type.decrement',
    };
    return types[type];
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

  /**
   * Model settings.
   */
  static get meta() {
    return InventoryAdjustmentSettings;
  }
}
