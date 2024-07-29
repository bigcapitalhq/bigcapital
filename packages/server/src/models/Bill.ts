import { Model, raw, mixin } from 'objection';
import { castArray, difference } from 'lodash';
import moment from 'moment';
import TenantModel from 'models/TenantModel';
import BillSettings from './Bill.Settings';
import ModelSetting from './ModelSetting';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from '@/services/Purchases/Bills/constants';
import ModelSearchable from './ModelSearchable';

export default class Bill extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  public amount: number;
  public paymentAmount: number;
  public landedCostAmount: number;
  public allocatedCostAmount: number;
  public isInclusiveTax: boolean;
  public taxAmountWithheld: number;
  public exchangeRate: number;

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
      'amountLocal',
      'subtotal',
      'subtotalLocal',
      'subtotalExludingTax',
      'taxAmountWithheldLocal',
      'total',
      'totalLocal',
    ];
  }

  /**
   * Invoice amount in base currency.
   * @returns {number}
   */
  get amountLocal() {
    return this.amount * this.exchangeRate;
  }

  /**
   * Subtotal. (Tax inclusive) if the tax inclusive is enabled.
   * @returns {number}
   */
  get subtotal() {
    return this.amount;
  }

  /**
   * Subtotal in base currency. (Tax inclusive) if the tax inclusive is enabled.
   * @returns {number}
   */
  get subtotalLocal() {
    return this.amountLocal;
  }

  /**
   * Sale invoice amount excluding tax.
   * @returns {number}
   */
  get subtotalExcludingTax() {
    return this.isInclusiveTax
      ? this.subtotal - this.taxAmountWithheld
      : this.subtotal;
  }

  /**
   * Tax amount withheld in base currency.
   * @returns {number}
   */
  get taxAmountWithheldLocal() {
    return this.taxAmountWithheld * this.exchangeRate;
  }

  /**
   * Invoice total. (Tax included)
   * @returns {number}
   */
  get total() {
    return this.isInclusiveTax
      ? this.subtotal
      : this.subtotal + this.taxAmountWithheld;
  }

  /**
   * Invoice total in local currency. (Tax included)
   * @returns {number}
   */
  get totalLocal() {
    return this.total * this.exchangeRate;
  }

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
   * Invoice amount in organization base currency.
   * @deprecated
   * @returns {number}
   */
  get localAmount() {
    return this.amountLocal;
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
    return Math.max(this.total - this.balance, 0);
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
    return this.dueAmount !== this.total && this.dueAmount > 0;
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

  /**
   * Retrieves the calculated amount which have not been invoiced.
   */
  get billableAmount() {
    return Math.max(this.total - this.invoicedAmount, 0);
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
    const TaxRateTransaction = require('models/TaxRateTransaction');
    const Document = require('models/Document');
    const { MatchedBankTransaction } = require('models/MatchedBankTransaction');

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

      /**
       * Bill may has associated tax rate transactions.
       */
      taxes: {
        relation: Model.HasManyRelation,
        modelClass: TaxRateTransaction.default,
        join: {
          from: 'bills.id',
          to: 'tax_rate_transactions.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'Bill');
        },
      },

      /**
       * Bill may has many attached attachments.
       */
      attachments: {
        relation: Model.ManyToManyRelation,
        modelClass: Document.default,
        join: {
          from: 'bills.id',
          through: {
            from: 'document_links.modelId',
            to: 'document_links.documentId',
          },
          to: 'documents.id',
        },
        filter(query) {
          query.where('model_ref', 'Bill');
        },
      },

      /**
       * Bill may belongs to matched bank transaction.
       */
      matchedBankTransaction: {
        relation: Model.HasManyRelation,
        modelClass: MatchedBankTransaction,
        join: {
          from: 'bills.id',
          to: 'matched_bank_transactions.referenceId',
        },
        filter(query) {
          query.where('reference_type', 'Bill');
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

  static changePaymentAmount(billId, amount, trx) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';
    return this.query(trx)
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
