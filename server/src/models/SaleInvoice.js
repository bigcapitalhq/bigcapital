import { Model, raw } from 'objection';
import moment from 'moment';
import TenantModel from 'models/TenantModel';
import { defaultToTransform } from 'utils';
import { QueryBuilder } from 'knex';

export default class SaleInvoice extends TenantModel {
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
    return [
      'dueAmount',
      'isDelivered',
      'isOverdue',
      'isPartiallyPaid',
      'isFullyPaid',
      'isPaid',
      'remainingDays',
      'overdueDays',
    ];
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
   * Equation (Invoice amount - payment amount = Due amount)
   * @return {boolean}
   */
  get dueAmount() {
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
      /**
       * Filters the due invoices.
       */
      dueInvoices(query) {
        query.where(raw('BALANCE - PAYMENT_AMOUNT > 0'));
      },
      /**
       * Filters the invoices between the given date range.
       */
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
      /**
       * Filters the invoices in draft status.
       */
      draft(query) {
        query.where('delivered_at', null);
      },
      /**
       * Filters the delivered invoices.
       */
      delivered(query) {
        query.whereNot('delivered_at', null);
      },
      /**
       * Filters the unpaid invoices.
       */
      unpaid(query) {
        query.where(raw('PAYMENT_AMOUNT = 0'));
      },
      /**
       * Filters the overdue invoices.
       */
      overdue(query) {
        query.where('due_date', '<', moment().format('YYYY-MM-DD'));
      },
      /**
       * Filters the partially invoices.
       */
      partiallyPaid(query) {
        query.whereNot('payment_amount', 0);
        query.whereNot(raw('`PAYMENT_AMOUNT` = `BALANCE`'));
      },
      /**
       * Filters the paid invoices.
       */
      paid(query) {
        query.where(raw('PAYMENT_AMOUNT = BALANCE'));
      }
    };
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
      customer: {
        label: 'Customer',
        column: 'customer_id',
        fieldType: 'options',
        optionsResource: 'customers',
        optionsKey: 'id',
        optionsLable: 'displayName',
      },
      invoice_date: {
        label: 'Invoice date',
        column: 'invoice_date',
        columnType: 'date',
        fieldType: 'date',
      },
      due_date: {
        label: 'Due date',
        column: 'due_date',
        columnType: 'date',
        fieldType: 'date',
      },
      invoice_no: {
        label: 'Invoice No.',
        column: 'invoice_no',
        columnType: 'number',
        fieldType: 'number',
      },
      refernece_no: {
        label: 'Reference No.',
        column: 'reference_no',
        columnType: 'number',
        fieldType: 'number',
      },
      invoice_message: {
        label: 'Invoice message',
        column: 'invoice_message',
        columnType: 'text',
        fieldType: 'text',
      },
      terms_conditions: {
        label: 'Terms & conditions',
        column: 'terms_conditions',
        columnType: 'text',
        fieldType: 'text',
      },
      invoice_amount: {
        label: 'Invoice amount',
        column: 'invoice_amount',
        columnType: 'number',
        fieldType: 'number',
      },
      payment_amount: {
        label: 'Payment amount',
        column: 'payment_amount',
        columnType: 'number',
        fieldType: 'number',
      },
      due_amount: {
        label: 'Due amount',
        column: 'due_amount',
        columnType: 'number',
        fieldType: 'number',
      },
      created_at: {
        label: 'Created at',
        column: 'created_at',
        columnType: 'date',
      },
      status: {
        label: 'Status',
        options: [
          { key: 'draft', label: 'Draft', },
          { key: 'delivered', label: 'Delivered' },
          { key: 'unpaid', label: 'Unpaid' },
          { key: 'overdue', label: 'Overdue' },
          { key: 'partially-paid', label: 'Partially paid' },
          { key: 'paid', label: 'Paid' },
        ],
        query: (query, role) => {
          switch(role.value) {
            case 'draft':
              query.modify('draft');
              break;
            case 'delivered':
              query.modify('delivered');
              break;
            case 'unpaid':
              query.modify('unpaid');
              break;
            case 'overdue':
              query.modify('overdue');
              break;
            case 'partially-paid':
              query.modify('partiallyPaid');
              break;
            case 'paid':
              query.modify('paid');
              break;
          }
        },
      }
    };
  }
}
