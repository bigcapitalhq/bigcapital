import { Model, raw, mixin } from 'objection';
import { castArray, difference } from 'lodash';
import moment from 'moment';
import TenantModel from 'models/TenantModel';
import BillSettings from './Bill.Settings';
import ModelSetting from './ModelSetting';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from '@/services/Purchases/constants';
import ModelSearchable from './ModelSearchable';

export default class Bill extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
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
      published(query) {
        query.whereNot('openedAt', null);
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
        query.where(
          raw(`COALESCE(AMOUNT, 0) -
            COALESCE(PAYMENT_AMOUNT, 0) -
            COALESCE(CREDITED_AMOUNT, 0) > 0
          `)
        );
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

      /**
       * Filters by branches.
       */
      filterByBranches(query, branchesIds) {
        const formattedBranchesIds = castArray(branchesIds);

        query.whereIn('branchId', formattedBranchesIds);
      },

      dueBillsFromDate(query, asDate = moment().format('YYYY-MM-DD')) {
        query.modify('dueBills');
        query.modify('notOverdue');
        query.modify('fromDate', asDate);
      },

      overdueBillsFromDate(query, asDate = moment().format('YYYY-MM-DD')) {
        query.modify('dueBills');
        query.modify('overdue', asDate);
        query.modify('fromDate', asDate);
      },

      /**
       *
       */
      billable(query) {
        query.where(raw('AMOUNT > INVOICED_AMOUNT'));
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
      'balance',
      'dueAmount',
      'isOpen',
      'isPartiallyPaid',
      'isFullyPaid',
      'isPaid',
      'remainingDays',
      'overdueDays',
      'isOverdue',
      'unallocatedCostAmount',
      'localAmount',
      'localAllocatedCostAmount',
      'billableAmount',
    ];
  }

  /**
   * Invoice amount in organization base currency.
   * @returns {number}
   */
  get localAmount() {
    return this.amount * this.exchangeRate;
  }

  /**
   * Retrieves the local allocated cost amount.
   * @returns {number}
   */
  get localAllocatedCostAmount() {
    return this.allocatedCostAmount * this.exchangeRate;
  }

  /**
   * Retrieves the local landed cost amount.
   * @returns {number}
   */
  get localLandedCostAmount() {
    return this.landedCostAmount * this.exchangeRate;
  }

  /**
   * Retrieves the local unallocated cost amount.
   * @returns {number}
   */
  get localUnallocatedCostAmount() {
    return this.unallocatedCostAmount * this.exchangeRate;
  }

  /**
   * Retrieve the balance of bill.
   * @return {number}
   */
  get balance() {
    return this.paymentAmount + this.creditedAmount;
  }

  /**
   * Due amount of the given.
   * @return {number}
   */
  get dueAmount() {
    return Math.max(this.amount - this.balance, 0);
  }

  /**
   * Determine whether the bill is open.
   * @return {boolean}
   */
  get isOpen() {
    return !!this.openedAt;
  }

  /**
   * Determine whether the bill paid partially.
   * @return {boolean}
   */
  get isPartiallyPaid() {
    return this.dueAmount !== this.amount && this.dueAmount > 0;
  }

  /**
   * Determine whether the bill paid fully.
   * @return {boolean}
   */
  get isFullyPaid() {
    return this.dueAmount === 0;
  }

  /**
   * Determines whether the bill paid fully or partially.
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
    const currentMoment = moment();
    const dueDateMoment = moment(this.dueDate);

    return Math.max(dueDateMoment.diff(currentMoment, 'days'), 0);
  }

  /**
   * Retrieve the overdue days in number.
   * @return {number|null}
   */
  get overdueDays() {
    const currentMoment = moment();
    const dueDateMoment = moment(this.dueDate);

    return Math.max(currentMoment.diff(dueDateMoment, 'days'), 0);
  }

  /**
   * Determines the due date is over.
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

  /**
   * Retrieves the calculated amount which have not been invoiced.
   */
  get billableAmount() {
    return Math.max(this.amount - this.invoicedAmount, 0);
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
    const Vendor = require('models/Vendor');
    const ItemEntry = require('models/ItemEntry');
    const BillLandedCost = require('models/BillLandedCost');
    const Branch = require('models/Branch');

    return {
      vendor: {
        relation: Model.BelongsToOneRelation,
        modelClass: Vendor.default,
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
          builder.orderBy('index', 'ASC');
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

      /**
       * Bill may belongs to associated branch.
       */
      branch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Branch.default,
        join: {
          from: 'bills.branchId',
          to: 'branches.id',
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

  /**
   * Retrieve the default custom views, roles and columns.
   */
  static get defaultViews() {
    return DEFAULT_VIEWS;
  }

  /**
   * Model search attributes.
   */
  static get searchRoles() {
    return [
      { fieldKey: 'bill_number', comparator: 'contains' },
      { condition: 'or', fieldKey: 'reference_no', comparator: 'contains' },
      { condition: 'or', fieldKey: 'amount', comparator: 'equals' },
    ];
  }

  /**
   * Prevents mutate base currency since the model is not empty.
   */
  static get preventMutateBaseCurrency() {
    return true;
  }
}
