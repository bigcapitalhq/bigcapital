import { Model, mixin } from 'objection';
// import TenantModel from 'models/TenantModel';
// import InventoryAdjustmentSettings from './InventoryAdjustment.Settings';
// import ModelSetting from './ModelSetting';
import { BaseModel } from '@/models/Model';
import { InventoryAdjustmentEntry } from './InventoryAdjustmentEntry';

export class InventoryAdjustment extends BaseModel {
  date!: string;
  type!: string;
  adjustmentAccountId!: number;
  reason?: string;
  referenceNo!: string;
  description?: string;
  userId!: number;
  publishedAt?: string;

  branchId!: number;
  warehouseId!: number;

  createdAt!: Date | string;

  entries: InventoryAdjustmentEntry[];

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
   * Detarmines whether the adjustment is published.
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
    const { InventoryAdjustmentEntry } = require('./InventoryAdjustmentEntry');
    const { Account } = require('../../Accounts/models/Account.model');

    return {
      /**
       * Adjustment entries.
       */
      entries: {
        relation: Model.HasManyRelation,
        modelClass: InventoryAdjustmentEntry,
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
        modelClass: Account,
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
  // static get meta() {
  //   return InventoryAdjustmentSettings;
  // }
}
