import { Model } from 'objection';
import TenantModel from 'models/TenantModel';
import { AccountTransaction } from 'models';

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
   * Relationship mapping.
   */
  static get relationMappings() {
    const Media = require('models/Media');
    const AccountTransaction = require('models/AccountTransaction');

    return {
      entries: {
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
        column: 'date',
      },
      journal_number: {
        column: 'journal_number',
      },
      reference: {
        column: 'reference',
      },
      status: {
        column: 'status',
      },
      amount: {
        column: 'amount',
      },
      description: {
        column: 'description',
      },
      user: {
        column: 'user_id',
        relation: 'users.id',
        relationColumn: 'users.id',
      },
      journal_type: {
        column: 'journal_type',
      },
      created_at: {
        column: 'created_at',
      },
    };
  }
}
