import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class ManualJournal extends TenantModel {
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
    return [
      'isPublished',
    ];
  }

  /**
   * Detarmines whether the invoice is published.
   * @return {boolean}
   */
  get isPublished() {
    return !!this.publishedAt;
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
        }
      }
    };
  }

  /**
   * Model defined fields.
   */
  static get fields() {
    return {
      date: {
        label: 'Date',
        column: 'date',
        columnType: 'date',
      },
      journal_number: {
        label: 'Journal number',
        column: 'journal_number',
        columnType: 'string',
      },
      reference: {
        label: 'Reference No.',
        column: 'reference',
        columnType: 'string',
      },
      status: {
        label: 'Status',
        column: 'status',
      },
      amount: {
        label: 'Amount',
        column: 'amount',
        columnType: 'number',
      },
      description: {
        label: 'Description',
        column: 'description',
        columnType: 'string',
      },
      user: {
        label: 'User',
        column: 'user_id',
        relation: 'users.id',
        relationColumn: 'users.id',
      },
      journal_type: {
        label: 'Journal type',
        column: 'journal_type',
      },
      created_at: {
        label: 'Created at',
        column: 'created_at',
      },
    };
  }
}
