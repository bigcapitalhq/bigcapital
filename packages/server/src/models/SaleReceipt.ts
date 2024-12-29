import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import SaleReceiptSettings from './SaleReceipt.Settings';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from '@/services/Sales/Receipts/constants';
import ModelSearchable from './ModelSearchable';
import { DiscountType } from '@/interfaces';
import { defaultTo } from 'lodash';

export default class SaleReceipt extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  public amount: number;
  public exchangeRate: number;
  public closedAt: Date;

  public discount: number;
  public discountType: DiscountType;

  public adjustment: number;

  /**
   * Table name
   */
  static get tableName() {
    return 'sales_receipts';
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
      'localAmount',

      'subtotal',
      'subtotalLocal',

      'total',
      'totalLocal',

      'adjustment',
      'adjustmentLocal',

      'discountAmount',
      'discountAmountLocal',
      'discountPercentage',

      'paid',
      'paidLocal',

      'isClosed',
      'isDraft',
    ];
  }

  /**
   * Estimate amount in local currency.
   * @returns {number}
   */
  get localAmount() {
    return this.amount * this.exchangeRate;
  }

  /**
   * Receipt subtotal.
   * @returns {number}
   */
  get subtotal() {
    return this.amount;
  }

  /**
   * Receipt subtotal in local currency.
   * @returns {number}
   */
  get subtotalLocal() {
    return this.localAmount;
  }

  /**
   * Discount amount.
   * @returns {number}
   */
  get discountAmount() {
    return this.discountType === DiscountType.Amount
      ? this.discount
      : this.subtotal * (this.discount / 100);
  }

  /**
   * Discount amount in local currency.
   * @returns {number | null}
   */
  get discountAmountLocal() {
    return this.discountAmount ? this.discountAmount * this.exchangeRate : null;
  }

  /**
   * Discount percentage.
   * @returns {number | null}
   */
  get discountPercentage(): number | null {
    return this.discountType === DiscountType.Percentage ? this.discount : null;
  }

  /**
   * Receipt total.
   * @returns {number}
   */
  get total() {
    const adjustmentAmount = defaultTo(this.adjustment, 0);

    return this.subtotal - this.discountAmount + adjustmentAmount;
  }

  /**
   * Receipt total in local currency.
   * @returns {number}
   */
  get totalLocal() {
    return this.total * this.exchangeRate;
  }

  /**
   * Adjustment amount in local currency.
   * @returns {number}
   */
  get adjustmentLocal() {
    return this.adjustment * this.exchangeRate;
  }

  /**
   * Receipt paid amount.
   * @returns {number}
   */
  get paid() {
    return this.total;
  }

  /**
   * Receipt paid amount in local currency.
   * @returns {number}
   */
  get paidLocal() {
    return this.paid * this.exchangeRate;
  }

  /**
   * Detarmine whether the sale receipt closed.
   * @return {boolean}
   */
  get isClosed() {
    return !!this.closedAt;
  }

  /**
   * Detarmines whether the sale receipt drafted.
   * @return {boolean}
   */
  get isDraft() {
    return !this.closedAt;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Filters the closed receipts.
       */
      closed(query) {
        query.whereNot('closed_at', null);
      },

      /**
       * Filters the invoices in draft status.
       */
      draft(query) {
        query.where('closed_at', null);
      },

      /**
       * Sorting the receipts order by status.
       */
      sortByStatus(query, order) {
        query.orderByRaw(`CLOSED_AT IS NULL ${order}`);
      },

      /**
       * Filtering the receipts orders by status.
       */
      filterByStatus(query, status) {
        switch (status) {
          case 'draft':
            query.modify('draft');
            break;
          case 'closed':
          default:
            query.modify('closed');
            break;
        }
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Customer = require('models/Customer');
    const Account = require('models/Account');
    const AccountTransaction = require('models/AccountTransaction');
    const ItemEntry = require('models/ItemEntry');
    const Branch = require('models/Branch');
    const Document = require('models/Document');
    const Warehouse = require('models/Warehouse');

    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer.default,
        join: {
          from: 'sales_receipts.customerId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_service', 'customer');
        },
      },

      depositAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'sales_receipts.depositAccountId',
          to: 'accounts.id',
        },
      },

      entries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'sales_receipts.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'SaleReceipt');
          builder.orderBy('index', 'ASC');
        },
      },

      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'sales_receipts.id',
          to: 'accounts_transactions.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'SaleReceipt');
        },
      },

      /**
       * Sale receipt may belongs to branch.
       */
      branch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Branch.default,
        join: {
          from: 'sales_receipts.branchId',
          to: 'branches.id',
        },
      },

      /**
       * Sale receipt may has associated warehouse.
       */
      warehouse: {
        relation: Model.BelongsToOneRelation,
        modelClass: Warehouse.default,
        join: {
          from: 'sales_receipts.warehouseId',
          to: 'warehouses.id',
        },
      },

      /**
       * Sale receipt transaction may has many attached attachments.
       */
      attachments: {
        relation: Model.ManyToManyRelation,
        modelClass: Document.default,
        join: {
          from: 'sales_receipts.id',
          through: {
            from: 'document_links.modelId',
            to: 'document_links.documentId',
          },
          to: 'documents.id',
        },
        filter(query) {
          query.where('model_ref', 'SaleReceipt');
        },
      },
    };
  }

  /**
   * Sale invoice meta.
   */
  static get meta() {
    return SaleReceiptSettings;
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
      { fieldKey: 'receipt_number', comparator: 'contains' },
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
