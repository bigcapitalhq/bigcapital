import { BaseModel } from '@/models/Model';
import { Model, raw } from 'objection';

export class InventoryTransactionMeta extends BaseModel {
  transactionNumber!: string;
  description!: string;
  inventoryTransactionId!: number;

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
    const { InventoryTransaction } = require('./InventoryTransaction');

    return {
      inventoryTransaction: {
        relation: Model.BelongsToOneRelation,
        modelClass: InventoryTransaction,
        join: {
          from: 'inventory_transaction_meta.inventoryTransactionId',
          to: 'inventory_transactions.inventoryTransactionId'
        }
      }
    };
  }
}
