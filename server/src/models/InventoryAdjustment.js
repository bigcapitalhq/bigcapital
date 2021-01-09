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
   * Relationship mapping.
   */
  static get relationMappings() {
    const Account = require('models/InventoryAdjustmentEntry');
    
    return {
      entries: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'inventory_adjustments.id',
          to: 'inventory_adjustments_entries.adjustmentId',
        },
      },
    };
  }
}
