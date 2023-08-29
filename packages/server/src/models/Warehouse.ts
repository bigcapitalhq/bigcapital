import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class Warehouse extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'warehouses';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Filters accounts by the given ids.
       * @param {Query} query
       * @param {number[]} accountsIds
       */
      isPrimary(query) {
        query.where('primary', true);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const SaleInvoice = require('models/SaleInvoice');
    const SaleEstimate = require('models/SaleEstimate');
    const SaleReceipt = require('models/SaleReceipt');
    const Bill = require('models/Bill');
    const VendorCredit = require('models/VendorCredit');
    const CreditNote = require('models/CreditNote');
    const InventoryTransaction = require('models/InventoryTransaction');
    const WarehouseTransfer = require('models/WarehouseTransfer');
    const InventoryAdjustment = require('models/InventoryAdjustment');

    return {
      /**
       * Warehouse may belongs to associated sale invoices.
       */
      invoices: {
        relation: Model.HasManyRelation,
        modelClass: SaleInvoice.default,
        join: {
          from: 'warehouses.id',
          to: 'sales_invoices.warehouseId',
        },
      },

      /**
       * Warehouse may belongs to associated sale estimates.
       */
      estimates: {
        relation: Model.HasManyRelation,
        modelClass: SaleEstimate.default,
        join: {
          from: 'warehouses.id',
          to: 'sales_estimates.warehouseId',
        },
      },

      /**
       * Warehouse may belongs to associated sale receipts.
       */
      receipts: {
        relation: Model.HasManyRelation,
        modelClass: SaleReceipt.default,
        join: {
          from: 'warehouses.id',
          to: 'sales_receipts.warehouseId',
        },
      },

      /**
       * Warehouse may belongs to associated bills.
       */
      bills: {
        relation: Model.HasManyRelation,
        modelClass: Bill.default,
        join: {
          from: 'warehouses.id',
          to: 'bills.warehouseId',
        },
      },

      /**
       * Warehouse may belongs to associated credit notes.
       */
      creditNotes: {
        relation: Model.HasManyRelation,
        modelClass: CreditNote.default,
        join: {
          from: 'warehouses.id',
          to: 'credit_notes.warehouseId',
        },
      },

      /**
       * Warehouse may belongs to associated to vendor credits.
       */
      vendorCredit: {
        relation: Model.HasManyRelation,
        modelClass: VendorCredit.default,
        join: {
          from: 'warehouses.id',
          to: 'vendor_credits.warehouseId',
        },
      },

      /**
       * Warehouse may belongs to associated to inventory transactions.
       */
      inventoryTransactions: {
        relation: Model.HasManyRelation,
        modelClass: InventoryTransaction.default,
        join: {
          from: 'warehouses.id',
          to: 'inventory_transactions.warehouseId',
        },
      },

      warehouseTransferTo: {
        relation: Model.HasManyRelation,
        modelClass: WarehouseTransfer.default,
        join: {
          from: 'warehouses.id',
          to: 'warehouses_transfers.toWarehouseId',
        },
      },

      warehouseTransferFrom: {
        relation: Model.HasManyRelation,
        modelClass: WarehouseTransfer.default,
        join: {
          from: 'warehouses.id',
          to: 'warehouses_transfers.fromWarehouseId',
        },
      },

      inventoryAdjustment: {
        relation: Model.HasManyRelation,
        modelClass: InventoryAdjustment.default,
        join: {
          from: 'warehouses.id',
          to: 'inventory_adjustments.warehouseId',
        },
      },
    };
  }
}
