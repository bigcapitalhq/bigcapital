import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import { Account } from '@/modules/Accounts/models/Account.model';
import { Contact } from '@/modules/Contacts/models/Contact';
import { Branch } from '@/modules/Branches/models/Branch.model';

export class ManualJournalEntry extends BaseModel {
  index: number;
  credit: number;
  debit: number;
  accountId: number;
  note: string;
  contactId?: number;

  branchId!: number;
  projectId?: number;

  contact?: Contact;
  account?: Account;
  branch?: Branch;

  /**
   * Table name.
   */
  static get tableName() {
    return 'manual_journals_entries';
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
    const { Account } = require('../../Accounts/models/Account.model');
    const { Contact } = require('../../Contacts/models/Contact');
    const { Branch } = require('../../Branches/models/Branch.model');

    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'manual_journals_entries.accountId',
          to: 'accounts.id',
        },
      },
      contact: {
        relation: Model.BelongsToOneRelation,
        modelClass: Contact,
        join: {
          from: 'manual_journals_entries.contactId',
          to: 'contacts.id',
        },
      },
      branch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Branch,
        join: {
          from: 'manual_journals_entries.branchId',
          to: 'branches.id',
        },
      },
    };
  }
}
