import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

/**
 * Item batch model.
 */
export class Batch extends TenantBaseModel {
  public id!: number;
  public itemId!: number;
  public batchNumber!: string;
  public batchRef?: string | null;
  public manufacturedDate?: Date | string | null;
  public expiryDate?: Date | string | null;
  public quantity!: number;
  public sourceTransactionType?: string | null;
  public sourceTransactionId?: number | null;

  public createdAt?: Date;
  public updatedAt?: Date;

  /**
   * Table name.
   */
  static get tableName() {
    return 'batches';
  }

  /**
   * Timestamps columns.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Filters the batches by the given item id.
       */
      filterByItem(query, itemId: number) {
        query.where('batches.itemId', itemId);
      },

      /**
       * Filters the batches by the given item ids.
       */
      filterByItems(query, itemsIds: number[]) {
        query.whereIn('batches.itemId', itemsIds);
      },

      /**
       * Filters the batches by the given creation date range.
       */
      filterDateRange(query, fromDate?: Date | string, toDate?: Date | string) {
        if (fromDate) {
          query.where('batches.createdAt', '>=', fromDate);
        }
        if (toDate) {
          query.where('batches.createdAt', '<=', toDate);
        }
      },
    };
  }

  /**
   * Relationship mappings.
   */
  static get relationMappings() {
    const { Item } = require('../../../Items/models/Item');
    const {
      InventoryTransaction,
    } = require('../../../InventoryCost/models/InventoryTransaction');
    const {
      ItemEntry,
    } = require('../../../TransactionItemEntry/models/ItemEntry');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item,
        join: {
          from: 'batches.itemId',
          to: 'items.id',
        },
      },

      inventoryTransactions: {
        relation: Model.HasManyRelation,
        modelClass: InventoryTransaction,
        join: {
          from: 'batches.id',
          to: 'inventory_transactions.batchId',
        },
      },

      itemEntries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry,
        join: {
          from: 'batches.id',
          to: 'items_entries.batchId',
        },
      },
    };
  }
}
