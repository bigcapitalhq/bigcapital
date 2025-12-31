import { Model } from 'objection';
import { defaultTo } from 'lodash';
import * as R from 'ramda';
import { BaseModel } from '@/models/Model';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { Customer } from '@/modules/Customers/models/Customer';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { Branch } from '@/modules/Branches/models/Branch.model';
import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';
import { TaxRateTransaction } from '@/modules/TaxRates/models/TaxRateTransaction.model';
import { Document } from '@/modules/ChromiumlyTenancy/models/Document';
import { DiscountType } from '@/common/types/Discount';
import { MetadataModelMixin } from '@/modules/DynamicListing/models/MetadataModel';
import { ResourceableModelMixin } from '@/modules/Resource/models/ResourcableModel';
import { CustomViewBaseModelMixin } from '@/modules/CustomViews/CustomViewBaseModel';
import { SearchableBaseModelMixin } from '@/modules/DynamicListing/models/SearchableBaseModel';
import { ExportableModel } from '@/modules/Export/decorators/ExportableModel.decorator';
import { ImportableModel } from '@/modules/Import/decorators/Import.decorator';
import { InjectModelMeta } from '@/modules/Tenancy/TenancyModels/decorators/InjectModelMeta.decorator';
import { SaleReceiptMeta } from './SaleReceipt.meta';
import { InjectModelDefaultViews } from '@/modules/Views/decorators/InjectModelDefaultViews.decorator';
import { SaleReceiptDefaultViews } from '../constants';

const ExtendedModel = R.pipe(
  CustomViewBaseModelMixin,
  SearchableBaseModelMixin,
  ResourceableModelMixin,
  MetadataModelMixin,
)(BaseModel);

@ExportableModel()
@ImportableModel()
@InjectModelMeta(SaleReceiptMeta)
@InjectModelDefaultViews(SaleReceiptDefaultViews)
export class SaleReceipt extends ExtendedModel {
  public amount!: number;
  public exchangeRate!: number;
  public currencyCode!: string;
  public depositAccountId!: number;
  public customerId!: number;
  public receiptDate!: Date;
  public receiptNumber!: string;
  public referenceNo!: string;
  public sendToEmail!: string;
  public receiptMessage!: string;
  public statement!: string;
  public closedAt!: Date | string;
  public discountType!: DiscountType;
  public discount!: number;
  public adjustment!: number;

  public isInclusiveTax!: boolean;
  public taxAmountWithheld!: number;

  public branchId!: number;
  public warehouseId!: number;

  public userId!: number;

  public createdAt!: Date;
  public updatedAt!: Date | null;

  public customer!: Customer;
  public entries!: ItemEntry[];
  public transactions!: AccountTransaction[];
  public branch!: Branch;
  public warehouse!: Warehouse;
  public taxes!: TaxRateTransaction[];
  public attachments!: Document[];

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
      'subtotalExcludingTax',

      'total',
      'totalLocal',

      'adjustment',
      'adjustmentLocal',

      'discountAmount',
      'discountAmountLocal',
      'discountPercentage',

      'taxAmountWithheldLocal',

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
   * Subtotal excluding tax.
   * @returns {number}
   */
  get subtotalExcludingTax(): number {
    return this.isInclusiveTax
      ? this.subtotal - this.taxAmountWithheld
      : this.subtotal;
  }

  /**
   * Tax amount withheld in local currency.
   * @returns {number}
   */
  get taxAmountWithheldLocal(): number {
    return (this.taxAmountWithheld || 0) * this.exchangeRate;
  }

  /**
   * Receipt total. (Tax included)
   * @returns {number}
   */
  get total(): number {
    const adjustmentAmount = defaultTo(this.adjustment, 0);

    return R.compose(
      R.add(adjustmentAmount),
      R.subtract(R.__, this.discountAmount),
      R.when(R.always(!this.isInclusiveTax), R.add(this.taxAmountWithheld || 0)),
    )(this.subtotal);
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
    const { Customer } = require('../../Customers/models/Customer');
    const { Account } = require('../../Accounts/models/Account.model');
    const {
      AccountTransaction,
    } = require('../../Accounts/models/AccountTransaction.model');
    const {
      ItemEntry,
    } = require('../../TransactionItemEntry/models/ItemEntry');
    const { Branch } = require('../../Branches/models/Branch.model');
    const { Document } = require('../../ChromiumlyTenancy/models/Document');
    const { Warehouse } = require('../../Warehouses/models/Warehouse.model');
    const {
      TaxRateTransaction,
    } = require('../../TaxRates/models/TaxRateTransaction.model');

    return {
      /**
       * Sale receipt may has a customer.
       */
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: 'sales_receipts.customerId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_service', 'customer');
        },
      },

      /**
       * Sale receipt may has a deposit account.
       */
      depositAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'sales_receipts.depositAccountId',
          to: 'accounts.id',
        },
      },

      /**
       * Sale receipt may has many items entries.
       */
      entries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry,
        join: {
          from: 'sales_receipts.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'SaleReceipt');
          builder.orderBy('index', 'ASC');
        },
      },

      /**
       * Sale receipt may has many transactions.
       */
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction,
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
        modelClass: Branch,
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
        modelClass: Warehouse,
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
        modelClass: Document,
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

      /**
       * Sale receipt may has associated tax rate transactions.
       */
      taxes: {
        relation: Model.HasManyRelation,
        modelClass: TaxRateTransaction,
        join: {
          from: 'sales_receipts.id',
          to: 'tax_rate_transactions.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'SaleReceipt');
        },
      },
    };
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
