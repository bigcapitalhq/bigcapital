import { Model } from 'objection';
import { castArray } from 'lodash';
import * as moment from 'moment';
import { unitOfTime } from 'moment';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { SaleReceipt } from '@/modules/SaleReceipts/models/SaleReceipt';
import { Item } from '@/modules/Items/models/Item';
import { BaseModel } from '@/models/Model';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';

export class InventoryCostLotTracker extends BaseModel {
  date: Date;
  direction: string;
  itemId: number;
  quantity: number;
  rate: number;
  remaining: number;
  cost: number;
  transactionType: string;
  transactionId: number;
  costAccountId: number;
  entryId: number;
  createdAt: Date;

  exchangeRate: number;
  currencyCode: string;

  warehouseId: number;

  item?: Item;
  itemEntry?: ItemEntry;
  invoice?: SaleInvoice;
  receipt?: SaleReceipt;

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

      /**
       * Filters transactions by the given date range.
       */
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

      /**
       * Filters transactions by the given branches.
       */
      filterByBranches(query, branchesIds: number | Array<number>) {
        const formattedBranchesIds = castArray(branchesIds);

        query.whereIn('branchId', formattedBranchesIds);
      },

      /**
       * Filters transactions by the given warehosues.
       */
      filterByWarehouses(query, branchesIds: number | Array<number>) {
        const formattedWarehousesIds = castArray(branchesIds);

        query.whereIn('warehouseId', formattedWarehousesIds);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { Item } = require('../../Items/models/Item');
    const { SaleInvoice } = require('../../SaleInvoices/models/SaleInvoice');
    const {
      ItemEntry,
    } = require('../../TransactionItemEntry/models/ItemEntry');
    const { SaleReceipt } = require('../../SaleReceipts/models/SaleReceipt');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item,
        join: {
          from: 'inventory_cost_lot_tracker.itemId',
          to: 'items.id',
        },
      },
      invoice: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleInvoice,
        join: {
          from: 'inventory_cost_lot_tracker.transactionId',
          to: 'sales_invoices.id',
        },
      },
      itemEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemEntry,
        join: {
          from: 'inventory_cost_lot_tracker.entryId',
          to: 'items_entries.id',
        },
      },
      receipt: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleReceipt,
        join: {
          from: 'inventory_cost_lot_tracker.transactionId',
          to: 'sales_receipts.id',
        },
      },
    };
  }
}
