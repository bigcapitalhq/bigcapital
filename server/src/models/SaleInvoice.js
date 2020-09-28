import { Model, mixin } from 'objection';
import moment from 'moment';
import TenantModel from 'models/TenantModel';

export default class SaleInvoice extends TenantModel {
  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['dueAmount'];
  }

  /**
   * Table name
   */
  static get tableName() {
    return 'sales_invoices';
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
      filterDateRange(query, startDate, endDate, type = 'day') {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const fromDate = moment(startDate).startOf(type).format(dateFormat);
        const toDate = moment(endDate).endOf(type).format(dateFormat);

        if (startDate) {
          query.where('invoice_date', '>=', fromDate);
        }
        if (endDate) {
          query.where('invoice_date', '<=', toDate);
        }
      },
    };
  }

  /**
   * Due amount of the given.
   */
  get dueAmount() {
    return Math.max(this.balance - this.paymentAmount, 0);
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const AccountTransaction = require('models/AccountTransaction');
    const ItemEntry = require('models/ItemEntry');
    const Customer = require('models/Customer');
    const InventoryCostLotTracker = require('models/InventoryCostLotTracker');

    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'sales_invoices.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'SaleInvoice');
        },
      },

      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer.default,
        join: {
          from: 'sales_invoices.customerId',
          to: 'customers.id',
        },
      },

      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'sales_invoices.id',
          to: 'accounts_transactions.referenceId'
        },
        filter(builder) {
          builder.where('reference_type', 'SaleInvoice');
        },
      },

      costTransactions: {
        relation: Model.HasManyRelation,
        modelClass: InventoryCostLotTracker.default,
        join: {
          from: 'sales_invoices.id',
          to: 'inventory_cost_lot_tracker.transactionId'
        },
        filter(builder) {
          builder.where('transaction_type', 'SaleInvoice');
        },
      }
    };
  }

  /**
   * Change payment amount.
   * @param {Integer} invoiceId 
   * @param {Numeric} amount 
   */
  static async changePaymentAmount(invoiceId, amount) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';

    await this.query()
      .where('id', invoiceId)
      [changeMethod]('payment_amount', Math.abs(amount));      
  }


}
