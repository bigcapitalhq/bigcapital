import { Model } from 'objection';
import { InventoryAdjustmentEntry } from './InventoryAdjustmentEntry';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

export class InventoryAdjustment extends TenantBaseModel {
  public readonly date!: string;
  public readonly type!: string;
  public readonly adjustmentAccountId!: number;
  public readonly reason?: string;
  public readonly referenceNo!: string;
  public readonly description?: string;
  public readonly userId!: number;
  public readonly publishedAt?: string;

  public readonly branchId!: number;
  public readonly warehouseId!: number;

  public readonly createdAt!: Date | string;

  public readonly entries: InventoryAdjustmentEntry[];

  /**
   * Table name
   */
  static get tableName() {
    return 'inventory_adjustments';
  }

  /**
   * Timestamps columns.
   */
  get timestamps(): Array<string> {
    return ['created_at'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes(): Array<string> {
    return ['formattedType', 'inventoryDirection', 'isPublished'];
  }

  /**
   * Retrieve formatted adjustment type.
   */
  get formattedType(): string {
    return InventoryAdjustment.getFormattedType(this.type);
  }

  /**
   * Retrieve formatted reference type.
   */
  get inventoryDirection(): string {
    return InventoryAdjustment.getInventoryDirection(this.type);
  }

  /**
   * Detarmines whether the adjustment is published.
   * @return {boolean}
   */
  get isPublished(): boolean {
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
