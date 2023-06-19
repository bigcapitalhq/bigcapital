import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class Branch extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'branches';
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
    const PaymentReceive = require('models/PaymentReceive');
    const PaymentMade = require('models/BillPayment');
    const VendorCredit = require('models/VendorCredit');
    const CreditNote = require('models/CreditNote');
    const AccountTransaction = require('models/AccountTransaction');
    const InventoryTransaction = require('models/InventoryTransaction');

    return {
      /**
       * Branch may belongs to associated sale invoices.
       */
      invoices: {
        relation: Model.HasManyRelation,
        modelClass: SaleInvoice.default,
        join: {
          from: 'branches.id',
          to: 'sales_invoices.branchId',
        },
      },

      /**
       * Branch may belongs to associated sale estimates.
       */
      estimates: {
        relation: Model.HasManyRelation,
        modelClass: SaleEstimate.default,
        join: {
          from: 'branches.id',
          to: 'sales_estimates.branchId',
        },
      },

      /**
       * Branch may belongs to associated sale receipts.
       */
      receipts: {
        relation: Model.HasManyRelation,
        modelClass: SaleReceipt.default,
        join: {
          from: 'branches.id',
          to: 'sales_receipts.branchId',
        },
      },

      /**
       * Branch may belongs to associated payment receives.
       */
      paymentReceives: {
        relation: Model.HasManyRelation,
        modelClass: PaymentReceive.default,
        join: {
          from: 'branches.id',
          to: 'payment_receives.branchId',
        },
      },

      /**
       * Branch may belongs to associated bills.
       */
      bills: {
        relation: Model.HasManyRelation,
        modelClass: Bill.default,
        join: {
          from: 'branches.id',
          to: 'bills.branchId',
        },
      },

      /**
       * Branch may belongs to associated payments made.
       */
      paymentsMade: {
        relation: Model.HasManyRelation,
        modelClass: PaymentMade.default,
        join: {
          from: 'branches.id',
          to: 'bills_payments.branchId',
        },
      },

      /**
       * Branch may belongs to associated credit notes.
       */
      creditNotes: {
        relation: Model.HasManyRelation,
        modelClass: CreditNote.default,
        join: {
          from: 'branches.id',
          to: 'credit_notes.branchId',
        },
      },

      /**
       * Branch may belongs to associated to vendor credits.
       */
      vendorCredit: {
        relation: Model.HasManyRelation,
        modelClass: VendorCredit.default,
        join: {
          from: 'branches.id',
          to: 'vendor_credits.branchId',
        },
      },

      /**
       * Branch may belongs to associated to accounts transactions.
       */
      accountsTransactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'branches.id',
          to: 'accounts_transactions.branchId',
        },
      },

      /**
       * Branch may belongs to associated to inventory transactions.
       */
      inventoryTransactions: {
        relation: Model.HasManyRelation,
        modelClass: InventoryTransaction.default,
        join: {
          from: 'branches.id',
          to: 'inventory_transactions.branchId',
        },
      },
    };
  }
}
