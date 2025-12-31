import * as moment from 'moment';
import * as R from 'ramda';
import type { Knex } from 'knex';
import { Model, raw } from 'objection';
import { castArray, difference, defaultTo } from 'lodash';
import { BaseModel, PaginationQueryBuilderType } from '@/models/Model';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { BillLandedCost } from '@/modules/BillLandedCosts/models/BillLandedCost';
import { DiscountType } from '@/common/types/Discount';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { ExportableModel } from '@/modules/Export/decorators/ExportableModel.decorator';
import { InjectModelMeta } from '@/modules/Tenancy/TenancyModels/decorators/InjectModelMeta.decorator';
import { BillMeta } from './Bill.meta';
import { InjectModelDefaultViews } from '@/modules/Views/decorators/InjectModelDefaultViews.decorator';
import { BillDefaultViews } from '../Bills.constants';

@ExportableModel()
@InjectModelMeta(BillMeta)
@InjectModelDefaultViews(BillDefaultViews)
export class Bill extends TenantBaseModel {
  public amount: number;
  public paymentAmount: number;
  public landedCostAmount: number;
  public allocatedCostAmount: number;
  public isInclusiveTax: boolean;
  public taxAmountWithheld: number;
  public exchangeRate: number;
  public vendorId: number;
  public billNumber: string;
  public billDate: Date;
  public dueDate: Date;
  public referenceNo: string;
  public status: string;
  public note: string;
  public currencyCode: string;
  public creditedAmount: number;
  public invLotNumber: string;
  public invoicedAmount: number;
  public openedAt: Date | string;
  public userId: number;

  public discountType: DiscountType;
  public discount: number;
  public adjustment: number;

  public branchId: number;
  public warehouseId: number;
  public projectId: number;

  public createdAt: Date;
  public updatedAt: Date | null;

  public entries?: ItemEntry[];
  public locatedLandedCosts?: BillLandedCost[];
  public taxes?: any[];
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

      'discountAmount',
      'discountAmountLocal',
      'discountPercentage',

      'adjustmentLocal',

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
  get amountLocal(): number {
    return this.amount * this.exchangeRate;
  }

  /**
   * Subtotal. (Tax inclusive) if the tax inclusive is enabled.
   * @returns {number}
   */
  get subtotal(): number {
    return this.amount;
  }

  /**
   * Subtotal in base currency. (Tax inclusive) if the tax inclusive is enabled.
   * @returns {number}
   */
  get subtotalLocal(): number {
    return this.amountLocal;
  }

  /**
   * Sale invoice amount excluding tax.
   * @returns {number}
   */
  get subtotalExcludingTax(): number {
    return this.isInclusiveTax
      ? this.subtotal - this.taxAmountWithheld
      : this.subtotal;
  }

  /**
   * Tax amount withheld in base currency.
   * @returns {number}
   */
  get taxAmountWithheldLocal(): number {
    return this.taxAmountWithheld * this.exchangeRate;
  }

  /**
   * Discount amount.
   * @returns {number}
   */
  get discountAmount(): number {
    return this.discountType === DiscountType.Amount
      ? this.discount
      : this.subtotal * (this.discount / 100);
  }

  /**
   * Discount amount in local currency.
   * @returns {number | null}
   */
  get discountAmountLocal(): number | null {
    return this.discountAmount ? this.discountAmount * this.exchangeRate : null;
  }

  /**
  /**
   * Discount percentage.
   * @returns {number | null}
   */
  get discountPercentage(): number | null {
    return this.discountType === DiscountType.Percentage ? this.discount : null;
  }

  /**
   * Adjustment amount in local currency.
   * @returns {number | null}
   */
  get adjustmentLocal(): number | null {
    return this.adjustment ? this.adjustment * this.exchangeRate : null;
  }

  /**
   * Invoice total. (Tax included)
   * @returns {number}
   */
  get total(): number {
    const adjustmentAmount = defaultTo(this.adjustment, 0);

    return R.compose(
      R.add(adjustmentAmount),
      R.subtract(R.__, this.discountAmount),
      R.when(R.always(!this.isInclusiveTax), R.add(this.taxAmountWithheld)),
    )(this.subtotal);
  }

  /**
   * Invoice total in local currency. (Tax included)
   * @returns {number}
   */
  get totalLocal(): number {
    return this.total * this.exchangeRate;
  }

  /**
   * Invoice amount in organization base currency.
   * @deprecated
   * @returns {number}
   */
  get localAmount(): number {
    return this.amountLocal;
  }

  /**
   * Retrieves the local allocated cost amount.
   * @returns {number}
   */
  get localAllocatedCostAmount(): number {
    return this.allocatedCostAmount * this.exchangeRate;
  }

  /**
   * Retrieves the local landed cost amount.
   * @returns {number}
   */
  get localLandedCostAmount(): number {
    return this.landedCostAmount * this.exchangeRate;
  }

  /**
   * Retrieves the local unallocated cost amount.
   * @returns {number}
   */
  get localUnallocatedCostAmount(): number {
    return this.unallocatedCostAmount * this.exchangeRate;
  }

  /**
   * Retrieve the balance of bill.
   * @return {number}
   */
  get balance(): number {
    return this.paymentAmount + this.creditedAmount;
  }

  /**
   * Due amount of the given.
   * @return {number}
   */
  get dueAmount(): number {
    return Math.max(this.total - this.balance, 0);
  }

  /**
   * Detarmine whether the bill is open.
   * @return {boolean}
   */
  get isOpen(): boolean {
    return !!this.openedAt;
  }

  /**
   * Deetarmine whether the bill paid partially.
   * @return {boolean}
   */
  get isPartiallyPaid(): boolean {
    return this.dueAmount !== this.total && this.dueAmount > 0;
  }

  /**
   * Deetarmine whether the bill paid fully.
   * @return {boolean}
   */
  get isFullyPaid(): boolean {
    return this.dueAmount === 0;
  }

  /**
   * Detarmines whether the bill paid fully or partially.
   * @return {boolean}
   */
  get isPaid(): boolean {
    return this.isPartiallyPaid || this.isFullyPaid;
  }

  /**
   * Retrieve the remaining days in number
   * @return {number|null}
   */
  get remainingDays(): number | null {
    const currentMoment = moment();
    const dueDateMoment = moment(this.dueDate);

    return Math.max(dueDateMoment.diff(currentMoment, 'days'), 0);
  }

  /**
   * Retrieve the overdue days in number.
   * @return {number|null}
   */
  get overdueDays(): number | null {
    const currentMoment = moment();
    const dueDateMoment = moment(this.dueDate);

    return Math.max(currentMoment.diff(dueDateMoment, 'days'), 0);
  }

  /**
   * Detarmines the due date is over.
   * @return {boolean}
   */
  get isOverdue(): boolean {
    return this.overdueDays > 0;
  }

  /**
   * Retrieve the unallocated cost amount.
   * @return {number}
   */
  get unallocatedCostAmount(): number {
    return Math.max(this.landedCostAmount - this.allocatedCostAmount, 0);
  }

  /**
   * Retrieves the calculated amount which have not been invoiced.
   */
  get billableAmount(): number {
    return Math.max(this.total - this.invoicedAmount, 0);
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
          `),
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
   * Bill model settings.
   */
  // static get meta() {
  //   return BillSettings;
  // }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { Vendor } = require('../../Vendors/models/Vendor');
    const {
      ItemEntry,
    } = require('../../TransactionItemEntry/models/ItemEntry');
    const {
      BillLandedCost,
    } = require('../../BillLandedCosts/models/BillLandedCost');
    const { Branch } = require('../../Branches/models/Branch.model');
    const { Warehouse } = require('../../Warehouses/models/Warehouse.model');
    const { TaxRateModel } = require('../../TaxRates/models/TaxRate.model');
    const {
      TaxRateTransaction,
    } = require('../../TaxRates/models/TaxRateTransaction.model');
    const { Document } = require('../../ChromiumlyTenancy/models/Document');
    const {
      MatchedBankTransaction,
    } = require('../../BankingMatching/models/MatchedBankTransaction');

    return {
      vendor: {
        relation: Model.BelongsToOneRelation,
        modelClass: Vendor,
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
        modelClass: ItemEntry,
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
        modelClass: BillLandedCost,
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
        modelClass: Branch,
        join: {
          from: 'bills.branchId',
          to: 'branches.id',
        },
      },

      /**
       * Bill may has associated warehouse.
       */
      warehouse: {
        relation: Model.BelongsToOneRelation,
        modelClass: Warehouse,
        join: {
          from: 'bills.warehouseId',
          to: 'warehouses.id',
        },
      },

      /**
       * Bill may has associated tax rate transactions.
       */
      taxes: {
        relation: Model.HasManyRelation,
        modelClass: TaxRateTransaction,
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
        modelClass: Document,
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

  static changePaymentAmount(
    billId: number,
    amount: number,
    trx: Knex.Transaction,
  ) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';

    return this.query(trx)
      .where('id', billId)
      [changeMethod]('payment_amount', Math.abs(amount));
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
