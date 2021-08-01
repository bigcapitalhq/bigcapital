import { Model, raw, mixin } from 'objection';
import moment from 'moment';
import { difference } from 'lodash';
import TenantModel from 'models/TenantModel';
import BillSettings from './Bill.Settings';
import ModelSetting from './ModelSetting';

export default class Bill extends mixin(TenantModel, [ModelSetting]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'bills';
  }

  /**
   * Model modifiers.
   */
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
       * Filters the not overdue invoices.
       */
      notOverdue(query, asDate = moment().format('YYYY-MM-DD')) {
        query.where('due_date', '>=', asDate);
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
      /**
       * Filters the bills from the given date.
       */
      fromDate(query, fromDate) {
        query.where('bill_date', '<=', fromDate);
      },

      /**
       * Sort the bills by full-payment bills.
       */
      sortByStatus(query, order) {
        query.orderByRaw(`PAYMENT_AMOUNT = AMOUNT ${order}`);
      },

      /**
       * Status filter.
       */
      statusFilter(query, filterType) {
        switch (filterType) {
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
          default:
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
    };
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
      'unallocatedCostAmount',
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
    if (!this.dueDate) {
      return null;
    }

    const date = moment();
    const dueDate = moment(this.dueDate);

    return Math.max(dueDate.diff(date, 'days'), 0);
  }

  /**
   * Retrieve the overdue days in number.
   * @return {number|null}
   */
  get overdueDays() {
    return this.getOverdueDays();
  }

  /**
   * Detarmines the due date is over.
   * @return {boolean}
   */
  get isOverdue() {
    return this.overdueDays > 0;
  }

  /**
   * Retrieve the unallocated cost amount.
   * @return {number}
   */
  get unallocatedCostAmount() {
    return Math.max(this.landedCostAmount - this.allocatedCostAmount, 0);
  }

  getOverdueDays(asDate = moment().format('YYYY-MM-DD')) {
    // Can't continue in case due date not defined.
    if (!this.dueDate) {
      return null;
    }
    const date = moment(asDate);
    const dueDate = moment(this.dueDate);

    return Math.max(date.diff(dueDate, 'days'), 0);
  }

  /**
   * Bill model settings.
   */
  static get meta() {
    return BillSettings;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Contact = require('models/Contact');
    const ItemEntry = require('models/ItemEntry');
    const BillLandedCost = require('models/BillLandedCost');

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
        },
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

      locatedLandedCosts: {
        relation: Model.HasManyRelation,
        modelClass: BillLandedCost.default,
        join: {
          from: 'bills.id',
          to: 'bill_located_costs.billId',
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
    const storedBills = await this.query().onBuild((builder) => {
      builder.whereIn('id', billsIds);

      if (vendorId) {
        builder.where('vendor_id', vendorId);
      }
    });

    const storedBillsIds = storedBills.map((t) => t.id);

    const notFoundBillsIds = difference(billsIds, storedBillsIds);
    return notFoundBillsIds;
  }

  static changePaymentAmount(billId, amount) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';
    return this.query()
      .where('id', billId)
      [changeMethod]('payment_amount', Math.abs(amount));
  }
}
