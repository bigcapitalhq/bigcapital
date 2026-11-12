import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import { Account } from '@/modules/Accounts/models/Account.model';
import { Contact } from '@/modules/Contacts/models/Contact';
import { Branch } from '@/modules/Branches/models/Branch.model';
import type { RecurringJournalEntryTrackingCategory } from './RecurringJournalEntryTrackingCategory';

export class RecurringJournalEntry extends BaseModel {
  index: number;
  credit: number;
  debit: number;
  accountId: number;
  note?: string;
  contactId?: number;
  branchId?: number;
  projectId?: number;

  account?: Account;
  contact?: Contact;
  branch?: Branch;
  trackingCategories?: RecurringJournalEntryTrackingCategory[];

  /**
   * Table name.
   */
  static get tableName() {
    return 'recurring_journal_entries';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return [];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { Account } = require('../../../Accounts/models/Account.model');
    const { Contact } = require('../../../Contacts/models/Contact');
    const { Branch } = require('../../../Branches/models/Branch.model');
    const {
      RecurringJournalEntryTrackingCategory,
    } = require('./RecurringJournalEntryTrackingCategory');

    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'recurring_journal_entries.accountId',
          to: 'accounts.id',
        },
      },
      contact: {
        relation: Model.BelongsToOneRelation,
        modelClass: Contact,
        join: {
          from: 'recurring_journal_entries.contactId',
          to: 'contacts.id',
        },
      },
      branch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Branch,
        join: {
          from: 'recurring_journal_entries.branchId',
          to: 'branches.id',
        },
      },
      trackingCategories: {
        relation: Model.HasManyRelation,
        modelClass: RecurringJournalEntryTrackingCategory,
        join: {
          from: 'recurring_journal_entries.id',
          to: 'recurring_journal_entry_tracking_categories.recurringJournalEntryId',
        },
      },
    };
  }
}
