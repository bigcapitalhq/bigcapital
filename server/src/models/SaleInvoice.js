import { Model, raw } from 'objection';
import moment from 'moment';
import TenantModel from 'models/TenantModel';
import { defaultToTransform } from 'utils';

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
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['dueAmount', 'isDelivered', 'isOverdue', 'isPartiallyPaid', 'isFullyPaid', 'isPaid', 'remainingDays', 'overdueDays'];
  }

  /**
   * Detarmines whether the invoice is delivered.
   * @return {boolean}
   */
  get isDelivered() {
    return !!this.deliveredAt;
  }

  /**
   * Detarmines the due date is over.
   * @return {boolean}
   */
  get isOverdue() {
    return this.overdueDays > 0;
  }

  /**
   * Retrieve the invoice due amount.
   * (Invoice amount - payment amount = Due amount)
   * @return {boolean}
   */
  dueAmount() {
    return Math.max(this.balance - this.paymentAmount, 0);
  }

  /**
   * Detarmine whether the invoice paid partially.
   * @return {boolean}
   */
  get isPartiallyPaid() {
    return this.dueAmount !== this.balance && this.dueAmount > 0;
  }

  /**
   * Deetarmine whether the invoice paid fully.
   * @return {boolean}
   */
  get isFullyPaid() {
    return this.dueAmount === 0;
  }

  /**
   * Detarmines whether the invoice paid fully or partially.
   * @return {boolean}
   */
  get isPaid() {
    return this.isPartiallyPaid || this.isFullyPaid;
  }

  /**
   * Retrieve the remaining days in number
   * @return {number|null}
   */
  get remainingDays() {
    // Can't continue in case due date not defined.
    if (!this.dueDate) { return null; }

    const date = moment();
    const dueDate = moment(this.dueDate);

    return Math.max(dueDate.diff(date, 'days'), 0);
  }

  /**
   * Retrieve the overdue days in number.
   * @return {number|null}
   */
  get overdueDays() {
    // Can't continue in case due date not defined.
    if (!this.dueDate) { return null; }

    const date = moment();
    const dueDate = moment(this.dueDate);

    return Math.max(date.diff(dueDate, 'days'), 0);
  }

  static get resourceable() {
    return true;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      dueInvoices(query) {
        query.where(raw('BALANCE - PAYMENT_AMOUNT > 0'));
      },

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
    const Contact = require('models/Contact');
    const InventoryCostLotTracker = require('models/InventoryCostLotTracker');
    const PaymentReceiveEntry = require('models/PaymentReceiveEntry');

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
        modelClass: Contact.default,
        join: {
          from: 'sales_invoices.customerId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_service', 'Customer');
        }
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
      },

      paymentEntries: {
        relation: Model.HasManyRelation,
        modelClass: PaymentReceiveEntry.default,
        join: {
          from: 'sales_invoices.id',
          to: 'payment_receives_entries.invoice_id',
        },
      },
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

  /**
   * Model defined fields.
   */
  static get fields() {
    return {
      created_at: {
        label: 'Created at',
        column: 'created_at',
        columnType: 'date',
      },
    };
  }
}
