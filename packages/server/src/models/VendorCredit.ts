import { Model, raw, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import BillSettings from './Bill.Settings';
import ModelSetting from './ModelSetting';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from '@/services/Purchases/VendorCredits/constants';
import ModelSearchable from './ModelSearchable';
import VendorCreditMeta from './VendorCredit.Meta';

export default class VendorCredit extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'vendor_credits';
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['localAmount'];
  }

  /**
   * Vendor credit amount in local currency.
   * @returns {number}
   */
  get localAmount() {
    return this.amount * this.exchangeRate;
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
            COALESCE(AMOUNT)`)
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
            COALESCE(AMOUNT)`)
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
          `COALESCE(REFUNDED_AMOUNT) + COALESCE(INVOICED_AMOUNT) = COALESCE(AMOUNT) ${order}`
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
    return ['isDraft', 'isPublished', 'isOpen', 'isClosed', 'creditsRemaining'];
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
  static get meta() {
    return BillSettings;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Vendor = require('models/Vendor');
    const ItemEntry = require('models/ItemEntry');
    const Branch = require('models/Branch');
    const Document = require('models/Document');

    return {
      vendor: {
        relation: Model.BelongsToOneRelation,
        modelClass: Vendor.default,
        join: {
          from: 'vendor_credits.vendorId',
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
        modelClass: Branch.default,
        join: {
          from: 'vendor_credits.branchId',
          to: 'branches.id',
        },
      },

      /**
       * Vendor credit may has many attached attachments.
       */
      attachments: {
        relation: Model.ManyToManyRelation,
        modelClass: Document.default,
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
  static get meta() {
    return VendorCreditMeta;
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
