import { Model, raw } from 'objection';
import { Vendor } from '@/modules/Vendors/models/Vendor';
import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';
import { Branch } from '@/modules/Branches/models/Branch.model';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { DiscountType } from '@/common/types/Discount';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

export class VendorCredit extends TenantBaseModel {
  vendorId: number;
  amount: number;
  currencyCode: string;

  vendorCreditDate: Date;
  vendorCreditNumber: string;

  referenceNo: string;
  refundedAmount: number;
  invoicedAmount: number;
  adjustment: number;
  exchangeRate: number;
  note: string;
  openedAt: Date;
  userId: number;

  discount: number;
  discountType: DiscountType;

  branchId: number;
  warehouseId: number;

  vendor?: Vendor;
  warehouse?: Warehouse;
  branch?: Branch;
  entries?: ItemEntry[];
  attachments?: Document[];

  createdAt: Date;
  updatedAt: Date;

  /**
   * Table name
   */
  static get tableName() {
    return 'vendor_credits';
  }
  /**
   * Vendor credit amount in local currency.
   * @returns {number}
   */
  get localAmount() {
    return this.amount * this.exchangeRate;
  }

  /**
   * Vendor credit subtotal.
   * @returns {number}
   */
  get subtotal() {
    return this.amount;
  }

  /**
   * Vendor credit subtotal in local currency.
   * @returns {number}
   */
  get subtotalLocal() {
    return this.subtotal * this.exchangeRate;
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
   * Adjustment amount in local currency.
   * @returns {number | null}
   */
  get adjustmentLocal() {
    return this.adjustment ? this.adjustment * this.exchangeRate : null;
  }

  /**
   * Vendor credit total.
   * @returns {number}
   */
  get total() {
    return this.subtotal - this.discountAmount + this.adjustment;
  }

  /**
   * Vendor credit total in local currency.
   * @returns {number}
   */
  get totalLocal() {
    return this.total * this.exchangeRate;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Filters the credit notes in draft status.
       */
      draft(query) {
        query.where('opened_at', null);
      },

      /**
       * Filters the published vendor credits.
       */
      published(query) {
        query.whereNot('opened_at', null);
      },

      /**
       * Filters the open vendor credits.
       */
      open(query) {
        query
          .where(
            raw(`COALESCE(REFUNDED_AMOUNT) + COALESCE(INVOICED_AMOUNT) <
            COALESCE(AMOUNT)`),
          )
          .modify('published');
      },

      /**
       * Filters the closed vendor credits.
       */
      closed(query) {
        query
          .where(
            raw(`COALESCE(REFUNDED_AMOUNT) + COALESCE(INVOICED_AMOUNT) =
            COALESCE(AMOUNT)`),
          )
          .modify('published');
      },

      /**
       * Status filter.
       */
      filterByStatus(query, filterType) {
        switch (filterType) {
          case 'draft':
            query.modify('draft');
            break;
          case 'published':
            query.modify('published');
            break;
          case 'open':
          default:
            query.modify('open');
            break;
          case 'closed':
            query.modify('closed');
            break;
        }
      },

      /**
       *
       */
      sortByStatus(query, order) {
        query.orderByRaw(
          `COALESCE(REFUNDED_AMOUNT) + COALESCE(INVOICED_AMOUNT) = COALESCE(AMOUNT) ${order}`,
        );
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
      'isDraft',
      'isPublished',
      'isOpen',
      'isClosed',

      'creditsRemaining',
      'localAmount',

      'discountAmount',
      'discountAmountLocal',
      'discountPercentage',

      'adjustmentLocal',

      'total',
      'totalLocal',
    ];
  }

  /**
   * Detarmines whether the vendor credit is draft.
   * @returns {boolean}
   */
  get isDraft() {
    return !this.openedAt;
  }

  /**
   * Detarmines whether vendor credit is published.
   * @returns {boolean}
   */
  get isPublished() {
    return !!this.openedAt;
  }

  /**
   * Detarmines whether the credit note is open.
   * @return {boolean}
   */
  get isOpen() {
    return !!this.openedAt && this.creditsRemaining > 0;
  }

  /**
   * Detarmines whether the credit note is closed.
   * @return {boolean}
   */
  get isClosed() {
    return this.openedAt && this.creditsRemaining === 0;
  }

  /**
   * Retrieve the credits remaining.
   * @returns {number}
   */
  get creditsRemaining() {
    return Math.max(this.amount - this.refundedAmount - this.invoicedAmount, 0);
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
    const { Branch } = require('../../Branches/models/Branch.model');
    const { Document } = require('../../ChromiumlyTenancy/models/Document');
    const { Warehouse } = require('../../Warehouses/models/Warehouse.model');

    return {
      /**
       * Vendor credit may belongs to vendor.
       */
      vendor: {
        relation: Model.BelongsToOneRelation,
        modelClass: Vendor,
        join: {
          from: 'vendor_credits.vendorId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_service', 'vendor');
        },
      },

      /**
       * Vendor credit may has many item entries.
       */
      entries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry,
        join: {
          from: 'vendor_credits.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'VendorCredit');
          builder.orderBy('index', 'ASC');
        },
      },

      /**
       * Vendor credit may belongs to branch.
       */
      branch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Branch,
        join: {
          from: 'vendor_credits.branchId',
          to: 'branches.id',
        },
      },

      /**
       * Vendor credit may has associated warehouse.
       */
      warehouse: {
        relation: Model.BelongsToOneRelation,
        modelClass: Warehouse,
        join: {
          from: 'vendor_credits.warehouseId',
          to: 'warehouses.id',
        },
      },

      /**
       * Vendor credit may has many attached attachments.
       */
      attachments: {
        relation: Model.ManyToManyRelation,
        modelClass: Document,
        join: {
          from: 'vendor_credits.id',
          through: {
            from: 'document_links.modelId',
            to: 'document_links.documentId',
          },
          to: 'documents.id',
        },
        filter(query) {
          query.where('model_ref', 'VendorCredit');
        },
      },
    };
  }

  /**
   *
   */
  // static get meta() {
  //   return VendorCreditMeta;
  // }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  // static get defaultViews() {
  //   return DEFAULT_VIEWS;
  // }

  /**
   * Model search attributes.
   */
  static get searchRoles() {
    return [
      { fieldKey: 'credit_number', comparator: 'contains' },
      { condition: 'or', fieldKey: 'reference_no', comparator: 'contains' },
      { condition: 'or', fieldKey: 'amount', comparator: 'equals' },
    ];
  }

  /**
   * Prevents mutate base currency since the model is not empty.
   * @returns {boolean}
   */
  static get preventMutateBaseCurrency() {
    return true;
  }
}
