import { Model } from 'objection';
import { castArray, isEmpty } from 'lodash';
import moment from 'moment';
import TenantModel from 'models/TenantModel';

export default class InventoryCostLotTracker extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'inventory_cost_lot_tracker';
  }

  /**
   * Model timestamps.
   */
  static get timestamps() {
    return [];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      groupedEntriesCost(query) {
        query.select(['date', 'item_id', 'transaction_id', 'transaction_type']);
        query.sum('cost as cost');

        query.groupBy('transaction_id');
        query.groupBy('transaction_type');
        query.groupBy('date');
        query.groupBy('item_id');
      },
      filterDateRange(query, startDate, endDate, type = 'day') {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const fromDate = moment(startDate).startOf(type).format(dateFormat);
        const toDate = moment(endDate).endOf(type).format(dateFormat);

        if (startDate) {
          query.where('date', '>=', fromDate);
        }
        if (endDate) {
          query.where('date', '<=', toDate);
        }
      },

      /**
       * Filters transactions by the given branches.
       */
      filterByBranches(query, branchesIds) {
        const formattedBranchesIds = castArray(branchesIds);

        query.whereIn('branchId', formattedBranchesIds);
      },

      /**
       * Filters transactions by the given warehouses.
       */
      filterByWarehouses(query, branchesIds) {
        const formattedWarehousesIds = castArray(branchesIds);

        query.whereIn('warehouseId', formattedWarehousesIds);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Item = require('models/Item');
    const SaleInvoice = require('models/SaleInvoice');
    const ItemEntry = require('models/ItemEntry');
    const SaleReceipt = require('models/SaleReceipt');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item.default,
        join: {
          from: 'inventory_cost_lot_tracker.itemId',
          to: 'items.id',
        },
      },
      invoice: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleInvoice.default,
        join: {
          from: 'inventory_cost_lot_tracker.transactionId',
          to: 'sales_invoices.id',
        },
      },
      itemEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'inventory_cost_lot_tracker.entryId',
          to: 'items_entries.id',
        },
      },
      receipt: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleReceipt.default,
        join: {
          from: 'inventory_cost_lot_tracker.transactionId',
          to: 'sales_receipts.id',
        },
      },
    };
  }
}
