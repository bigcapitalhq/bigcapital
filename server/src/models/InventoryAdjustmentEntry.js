import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class InventoryAdjustmentEntry extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'inventory_adjustments_entries';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Account = require('models/InventoryAdjustment');
    
    return {
      entries: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'inventory_adjustments_entries.adjustmentId',
          to: 'inventory_adjustments.id',
        },
      },
    };
  }
}
