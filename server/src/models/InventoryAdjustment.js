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
