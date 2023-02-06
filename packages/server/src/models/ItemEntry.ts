import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class ItemEntry extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'items_entries';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  static get virtualAttributes() {
    return ['amount'];
  }

  get amount() {
    return ItemEntry.calcAmount(this);
  }

  static calcAmount(itemEntry) {
    const { discount, quantity, rate } = itemEntry;
    const total = quantity * rate;

    return discount ? total - total * discount * 0.01 : total;
  }

  static get relationMappings() {
    const Item = require('models/Item');
    const BillLandedCostEntry = require('models/BillLandedCostEntry');
    const SaleInvoice = require('models/SaleInvoice');
    const Bill = require('models/Bill');
    const SaleReceipt = require('models/SaleReceipt');
    const SaleEstimate = require('models/SaleEstimate');
    const ProjectTask = require('models/Task');
    const Expense = require('models/Expense');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item.default,
        join: {
          from: 'items_entries.itemId',
          to: 'items.id',
        },
      },
      allocatedCostEntries: {
        relation: Model.HasManyRelation,
        modelClass: BillLandedCostEntry.default,
        join: {
          from: 'items_entries.referenceId',
          to: 'bill_located_cost_entries.entryId',
        },
      },

      invoice: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleInvoice.default,
        join: {
          from: 'items_entries.referenceId',
          to: 'sales_invoices.id',
        },
      },

      bill: {
        relation: Model.BelongsToOneRelation,
        modelClass: Bill.default,
        join: {
          from: 'items_entries.referenceId',
          to: 'bills.id',
        },
      },

      estimate: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleEstimate.default,
        join: {
          from: 'items_entries.referenceId',
          to: 'sales_estimates.id',
        },
      },

      receipt: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleReceipt.default,
        join: {
          from: 'items_entries.referenceId',
          to: 'sales_receipts.id',
        },
      },

      /**
       *
       */
      projectTaskRef: {
        relation: Model.HasManyRelation,
        modelClass: ProjectTask.default,
        join: {
          from: 'items_entries.projectRefId',
          to: 'tasks.id',
        },
      },

      /**
       *
       */
      projectExpenseRef: {
        relation: Model.HasManyRelation,
        modelClass: Expense.default,
        join: {
          from: 'items_entries.projectRefId',
          to: 'expenses_transactions.id',
        },
      },

      /**
       *
       */
      projectBillRef: {
        relation: Model.HasManyRelation,
        modelClass: Bill.default,
        join: {
          from: 'items_entries.projectRefId',
          to: 'bills.id',
        },
      },
    };
  }
}
