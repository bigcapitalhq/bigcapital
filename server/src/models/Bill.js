import { Model, raw } from 'objection';
import moment from 'moment';
import { difference } from 'lodash';
import TenantModel from 'models/TenantModel';
import { query } from 'winston';

export default class Bill extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'bills';
  }

  static get resourceable() {
    return true;
  }

  static get modifiers() {
    return {
      /**
       * Filters the bills in draft status.
       */
      draft(query) {
        query.where('opened_at', null);
      },
      /**
       * Filters the opened bills.
       */
      opened(query) {
        query.whereNot('opened_at', null);
      },
      /**
       * Filters the unpaid bills.
       */
      unpaid(query) {
        query.where('payment_amount', 0);
      },
      /**
       * Filters the due bills.
       */
      dueBills(query) {
        query.where(raw('AMOUNT - PAYMENT_AMOUNT > 0'));
      },
      /**
       * Filters the overdue bills.
       */
      overdue(query) {
        query.where('due_date', '<', moment().format('YYYY-MM-DD'));
      },
      /**
       * Filters the partially paid bills.
       */
      partiallyPaid(query) {
        query.whereNot('payment_amount', 0);
        query.whereNot(raw('`PAYMENT_AMOUNT` = `AMOUNT`'));
      },
      /**
       * Filters the paid bills.
       */
      paid(query) {
        query.where(raw('`PAYMENT_AMOUNT` = `AMOUNT`'));
      },
    }
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

    /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [
      'dueAmount',
      'isOpen',
      'isPartiallyPaid',
      'isFullyPaid',
      'isPaid',
      'remainingDays',
      'overdueDays',
      'isOverdue',
    ];
  }

  /**
   * Due amount of the given.
   * @return {number}
   */
  get dueAmount() {
    return Math.max(this.amount - this.paymentAmount, 0);
  }

  /**
   * Detarmine whether the bill is open.
   * @return {boolean}
   */
  get isOpen() {
    return !!this.openedAt;
  }

  /**
   * Deetarmine whether the bill paid partially.
   * @return {boolean}
   */
  get isPartiallyPaid() {
    return this.dueAmount !== this.amount && this.dueAmount > 0;
  }

  /**
   * Deetarmine whether the bill paid fully.
   * @return {boolean}
   */
  get isFullyPaid() {
    return this.dueAmount === 0;
  } 

  /**
   * Detarmines whether the bill paid fully or partially.
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

  /**
   * Detarmines the due date is over.
   * @return {boolean}
   */
  get isOverdue() {
    return this.overdueDays > 0;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Contact = require('models/Contact');
    const ItemEntry = require('models/ItemEntry');

    return {
      vendor: {
        relation: Model.BelongsToOneRelation,
        modelClass: Contact.default,
        join: {
          from: 'bills.vendorId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_service', 'vendor');
        }
      },

      entries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'bills.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'Bill');
        },
      },
    };
  }

  /**
   * Retrieve the not found bills ids as array that associated to the given vendor.
   * @param {Array} billsIds 
   * @param {number} vendorId - 
   * @return {Array}
   */
  static async getNotFoundBills(billsIds, vendorId) {
    const storedBills = await this.query()
      .onBuild((builder) => {
        builder.whereIn('id', billsIds);

        if (vendorId) {
          builder.where('vendor_id', vendorId);
        }
      });
      
    const storedBillsIds = storedBills.map((t) => t.id);

    const notFoundBillsIds = difference(
      billsIds,
      storedBillsIds,
    );
    return notFoundBillsIds;
  }

  static changePaymentAmount(billId, amount) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';
    return this.query()
      .where('id', billId)
      [changeMethod]('payment_amount', Math.abs(amount));
  }

  static get fields() {
    return {
      vendor: {
        label: 'Vendor',
        column: 'vendor_id',
        relation: 'contacts.id',
        relationColumn: 'contacts.display_name',
      },
      bill_number: {
        label: 'Bill number',
        column: 'bill_number',
        columnType: 'string',
        fieldType: 'text',
      },
      bill_date: {
        label: 'Bill date',
        column: 'bill_date',
        columnType: 'date',
        fieldType: 'date',
      },
      due_date: {
        label: 'Due date',
        column: 'due_date',
      },
      reference_no: {
        label: 'Reference No.',
        column: 'reference_no',
        columnType: 'string',
        fieldType: 'text',
      },
      status: {
        label: 'Status',
        options: [],
        query: (query, role) => {
          switch(role.value) {
            case 'draft':
              query.modify('draft'); break;
            case 'opened':
              query.modify('opened'); break;
            case 'unpaid':
              query.modify('unpaid'); break;
            case 'overdue':
              query.modify('overdue'); break;
            case 'partially-paid':
              query.modify('partiallyPaid'); break;
            case 'paid':
              query.modify('paid'); break;
          }
        },
      },
      amount: {
        label: 'Amount',
        column: 'amount',
        columnType: 'number',
        fieldType: 'number',
      },
      payment_amount: {
        label: 'Payment amount',
        column: 'payment_amount',
        columnType: 'number',
        fieldType: 'number',
      },
      note: {
        label: 'Note',
        column: 'note',
      },
      user: {

      },
      created_at: {
        label: 'Created at',
        column: 'created_at',
        columnType: 'date',
      },
    }
  }
}
