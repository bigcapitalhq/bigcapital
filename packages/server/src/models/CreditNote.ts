import { mixin, Model, raw } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from '@/services/CreditNotes/constants';
import ModelSearchable from './ModelSearchable';
import CreditNoteMeta from './CreditNote.Meta';

export default class CreditNote extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'credit_notes';
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
      'isDraft',
      'isPublished',
      'isOpen',
      'isClosed',
      'creditsRemaining',
      'creditsUsed',
    ];
  }

  /**
   * Credit note amount in local currency.
   * @returns {number}
   */
  get localAmount() {
    return this.amount * this.exchangeRate;
  }

  /**
   * Determines whether the credit note is draft.
   * @returns {boolean}
   */
  get isDraft() {
    return !this.openedAt;
  }

  /**
   * Determines whether vendor credit is published.
   * @returns {boolean}
   */
  get isPublished() {
    return !!this.openedAt;
  }

  /**
   * Determines whether the credit note is open.
   * @return {boolean}
   */
  get isOpen() {
    return !!this.openedAt && this.creditsRemaining > 0;
  }

  /**
   * Determines whether the credit note is closed.
   * @return {boolean}
   */
  get isClosed() {
    return this.openedAt && this.creditsRemaining === 0;
  }

  /**
   * Retrieve the credits remaining.
   */
  get creditsRemaining() {
    return Math.max(this.amount - this.refundedAmount - this.invoicesAmount, 0);
  }

  get creditsUsed() {
    return this.refundedAmount + this.invoicesAmount;
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
       * Filters the.
       */
      published(query) {
        query.whereNot('opened_at', null);
      },

      /**
       * Filters the open credit notes.
       */
      open(query) {
        query
          .where(
            raw(`COALESCE(REFUNDED_AMOUNT) + COALESCE(INVOICES_AMOUNT) <
            COALESCE(AMOUNT)`)
          )
          .modify('published');
      },

      /**
       * Filters the closed credit notes.
       */
      closed(query) {
        query
          .where(
            raw(`COALESCE(REFUNDED_AMOUNT) + COALESCE(INVOICES_AMOUNT) =
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
          `COALESCE(REFUNDED_AMOUNT) + COALESCE(INVOICES_AMOUNT) = COALESCE(AMOUNT) ${order}`
        );
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const AccountTransaction = require('models/AccountTransaction');
    const ItemEntry = require('models/ItemEntry');
    const Customer = require('models/Customer');
    const Branch = require('models/Branch');

    return {
      /**
       * Credit note associated entries.
       */
      entries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'credit_notes.id',
          to: 'items_entries.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'CreditNote');
          builder.orderBy('index', 'ASC');
        },
      },

      /**
       * Belongs to customer model.
       */
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer.default,
        join: {
          from: 'credit_notes.customerId',
          to: 'contacts.id',
        },
        filter(query) {
          query.where('contact_service', 'Customer');
        },
      },

      /**
       * Credit note associated GL entries.
       */
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'credit_notes.id',
          to: 'accounts_transactions.referenceId',
        },
        filter(builder) {
          builder.where('reference_type', 'CreditNote');
        },
      },

      /**
       * Credit note may belongs to branch.
       */
      branch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Branch.default,
        join: {
          from: 'credit_notes.branchId',
          to: 'branches.id',
        },
      },
    };
  }

  /**
   * Sale invoice meta.
   */
  static get meta() {
    return CreditNoteMeta;
  }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  static get defaultViews() {
    return DEFAULT_VIEWS;
  }

  /**
   * Model searchable.
   */
  static get searchable() {
    return true;
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
