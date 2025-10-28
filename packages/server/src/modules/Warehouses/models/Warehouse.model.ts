// import { Model } from 'objection';
import { BaseModel, BaseQueryBuilder } from '@/models/Model';
import { Item } from '@/modules/Items/models/Item';
import { Model } from 'objection';

export class Warehouse extends BaseModel {
  name!: string;
  code!: string;
  city!: string;
  country!: string;
  address!: string;
  primary!: boolean;

  items!: Item[];

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
    const { SaleInvoice } = require('../../SaleInvoices/models/SaleInvoice');
    const { SaleEstimate } = require('../../SaleEstimates/models/SaleEstimate');
    const { SaleReceipt } = require('../../SaleReceipts/models/SaleReceipt');
    const { Bill } = require('../../Bills/models/Bill');
    const { VendorCredit } = require('../../VendorCredit/models/VendorCredit');
    const { CreditNote } = require('../../CreditNotes/models/CreditNote');
    const {
      InventoryTransaction,
    } = require('../../InventoryCost/models/InventoryTransaction');
    const {
      WarehouseTransfer,
    } = require('../../WarehousesTransfers/models/WarehouseTransfer');
    const {
      InventoryAdjustment,
    } = require('../../InventoryAdjutments/models/InventoryAdjustment');

    return {
      /**
       * Warehouse may belongs to associated sale invoices.
       */
      invoices: {
        relation: Model.HasManyRelation,
        modelClass: SaleInvoice,
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
        modelClass: SaleEstimate,
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
        modelClass: SaleReceipt,
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
        modelClass: Bill,
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
        modelClass: CreditNote,
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
        modelClass: VendorCredit,
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
        modelClass: InventoryTransaction,
        join: {
          from: 'warehouses.id',
          to: 'inventory_transactions.warehouseId',
        },
      },

      warehouseTransferTo: {
        relation: Model.HasManyRelation,
        modelClass: WarehouseTransfer,
        join: {
          from: 'warehouses.id',
          to: 'warehouses_transfers.toWarehouseId',
        },
      },

      warehouseTransferFrom: {
        relation: Model.HasManyRelation,
        modelClass: WarehouseTransfer,
        join: {
          from: 'warehouses.id',
          to: 'warehouses_transfers.fromWarehouseId',
        },
      },

      inventoryAdjustment: {
        relation: Model.HasManyRelation,
        modelClass: InventoryAdjustment,
        join: {
          from: 'warehouses.id',
          to: 'inventory_adjustments.warehouseId',
        },
      },
    };
  }
}
