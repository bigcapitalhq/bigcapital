import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import { formatNumber } from 'utils';
import ModelSetting from './ModelSetting';
import ManualJournalSettings from './ManualJournal.Settings';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from 'services/ManualJournals/constants';
export default class ManualJournal extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
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
      sortByStatus(query, order) {
        query.orderByRaw(`PUBLISHED_AT IS NULL ${order}`);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Media = require('models/Media');
    const AccountTransaction = require('models/AccountTransaction');
    const ManualJournalEntry = require('models/ManualJournalEntry');

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
      media: {
        relation: Model.ManyToManyRelation,
        modelClass: Media.default,
        join: {
          from: 'manual_journals.id',
          through: {
            from: 'media_links.model_id',
            to: 'media_links.media_id',
          },
          to: 'media.id',
        },
        filter(query) {
          query.where('model_name', 'ManualJournal');
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
}
