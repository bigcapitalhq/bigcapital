import { Model, raw } from 'objection';
import { castArray } from 'lodash';
import moment, { unitOfTime } from 'moment';
import { BaseModel } from '@/models/Model';
import { getTransactionTypeLabel } from '@/modules/BankingTransactions/utils';
import { TInventoryTransactionDirection } from '../types/InventoryCost.types';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

export class InventoryTransaction extends TenantBaseModel {
  date: Date | string;
  direction: TInventoryTransactionDirection;
  itemId: number;
  quantity: number | null;
  rate: number;
  transactionType: string;
  transactionId: number;
  costAccountId?: number;
  entryId: number;

  createdAt?: Date;
  updatedAt?: Date;

  warehouseId?: number;

  /**
   * Table name
   */
  static get tableName() {
    return 'inventory_transactions';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Retrieve formatted reference type.
   * @return {string}
   */
  get transcationTypeFormatted(): string {
    return getTransactionTypeLabel(this.transactionType);
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      filterDateRange(
        query,
        startDate,
        endDate,
        type: unitOfTime.StartOf = 'day',
      ) {
        const dateFormat = 'YYYY-MM-DD';
        const fromDate = moment(startDate).startOf(type).format(dateFormat);
        const toDate = moment(endDate).endOf(type).format(dateFormat);

        if (startDate) {
          query.where('date', '>=', fromDate);
        }
        if (endDate) {
          query.where('date', '<=', toDate);
        }
      },

      itemsTotals(builder) {
        builder.select('itemId');
        builder.sum('rate as rate');
        builder.sum('quantity as quantity');
        builder.select(raw('SUM(`QUANTITY` * `RATE`) as COST'));
        builder.groupBy('itemId');
      },

      INDirection(builder) {
        builder.where('direction', 'IN');
      },

      OUTDirection(builder) {
        builder.where('direction', 'OUT');
      },

      /**
       * Filters transactions by the given branches.
       */
      filterByBranches(query, branchesIds) {
        const formattedBranchesIds = castArray(branchesIds);

        query.whereIn('branch_id', formattedBranchesIds);
      },

      /**
       * Filters transactions by the given warehosues.
       */
      filterByWarehouses(query, warehousesIds) {
        const formattedWarehousesIds = castArray(warehousesIds);

        query.whereIn('warehouse_id', formattedWarehousesIds);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { Item } = require('../../Items/models/Item');
    const {
      ItemEntry,
    } = require('../../TransactionItemEntry/models/ItemEntry');
    const { InventoryTransactionMeta } = require('./InventoryTransactionMeta');
    const { InventoryCostLotTracker } = require('./InventoryCostLotTracker');

    return {
      // Transaction meta.
      meta: {
        relation: Model.HasOneRelation,
        modelClass: InventoryTransactionMeta,
        join: {
          from: 'inventory_transactions.id',
          to: 'inventory_transaction_meta.inventoryTransactionId',
        },
      },
      // Item cost aggregated.
      itemCostAggregated: {
        relation: Model.HasOneRelation,
        modelClass: InventoryCostLotTracker,
        join: {
          from: 'inventory_transactions.itemId',
          to: 'inventory_cost_lot_tracker.itemId',
        },
        filter(query) {
          query.select('itemId');
          query.sum('cost as cost');
          query.sum('quantity as quantity');
          query.groupBy('itemId');
        },
      },
      costLotAggregated: {
        relation: Model.HasOneRelation,
        modelClass: InventoryCostLotTracker,
        join: {
          from: 'inventory_transactions.id',
          to: 'inventory_cost_lot_tracker.inventoryTransactionId',
        },
        filter(query) {
          query.sum('cost as cost');
          query.sum('quantity as quantity');
          query.groupBy('inventoryTransactionId');
        },
      },
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item,
        join: {
          from: 'inventory_transactions.itemId',
          to: 'items.id',
        },
      },
      itemEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemEntry,
        join: {
          from: 'inventory_transactions.entryId',
          to: 'items_entries.id',
        },
      },
    };
  }
}
