import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import { formatNumber } from 'utils';
import ModelSetting from './ModelSetting';
import ManualJournalSettings from './ManualJournal.Settings';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from '@/services/ManualJournals/constants';
import ModelSearchable from './ModelSearchable';
export default class ManualJournal extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  /**
   * Table name.
   */
  static get tableName() {
    return 'manual_journals';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['isPublished', 'amountFormatted'];
  }

  /**
   * Retrieve the amount formatted value.
   */
  get amountFormatted() {
    return formatNumber(this.amount, { currencyCode: this.currencyCode });
  }

  /**
   * Detarmines whether the invoice is published.
   * @return {boolean}
   */
  get isPublished() {
    return !!this.publishedAt;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Sort by status query.
       */
      sortByStatus(query, order) {
        query.orderByRaw(`PUBLISHED_AT IS NULL ${order}`);
      },

      /**
       * Filter by draft status.
       */
      filterByDraft(query) {
        query.whereNull('publishedAt');
      },

      /**
       * Filter by published status.
       */
      filterByPublished(query) {
        query.whereNotNull('publishedAt');
      },

      /**
       * Filter by the given status.
       */
      filterByStatus(query, filterType) {
        switch (filterType) {
          case 'draft':
            query.modify('filterByDraft');
            break;
          case 'published':
          default:
            query.modify('filterByPublished');
            break;
        }
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const AccountTransaction = require('models/AccountTransaction');
    const ManualJournalEntry = require('models/ManualJournalEntry');
    const Document = require('models/Document');
    const { MatchedBankTransaction } = require('models/MatchedBankTransaction');

    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: ManualJournalEntry.default,
        join: {
          from: 'manual_journals.id',
          to: 'manual_journals_entries.manualJournalId',
        },
        filter(query) {
          query.orderBy('index', 'ASC');
        },
      },
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'manual_journals.id',
          to: 'accounts_transactions.referenceId',
        },
        filter: (query) => {
          query.where('referenceType', 'Journal');
        },
      },

      /**
       * Manual journal may has many attached attachments.
       */
      attachments: {
        relation: Model.ManyToManyRelation,
        modelClass: Document.default,
        join: {
          from: 'manual_journals.id',
          through: {
            from: 'document_links.modelId',
            to: 'document_links.documentId',
          },
          to: 'documents.id',
        },
        filter(query) {
          query.where('model_ref', 'ManualJournal');
        },
      },

      /**
       * Manual journal may belongs to matched bank transaction.
       */
      matchedBankTransaction: {
        relation: Model.BelongsToOneRelation,
        modelClass: MatchedBankTransaction,
        join: {
          from: 'manual_journals.id',
          to: 'matched_bank_transactions.referenceId',
        },
        filter(query) {
          query.where('reference_type', 'ManualJournal');
        },
      },
    };
  }

  static get meta() {
    return ManualJournalSettings;
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
      { fieldKey: 'journal_number', comparator: 'contains' },
      { condition: 'or', fieldKey: 'reference', comparator: 'contains' },
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
