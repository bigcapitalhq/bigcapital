import { Model, raw } from 'objection';
import TenantModel from 'models/TenantModel';

export default class InventoryTransactionMeta extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'inventory_transaction_meta';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const InventoryTransactions = require('models/InventoryTransaction');

    return {
      inventoryTransaction: {
        relation: Model.BelongsToOneRelation,
        modelClass: InventoryTransactions.default,
        join: {
          from: 'inventory_transaction_meta.inventoryTransactionId',
          to: 'inventory_transactions.inventoryTransactionId'
        }
      }
    };
  }
}
