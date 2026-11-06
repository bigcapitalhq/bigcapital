import { Model } from 'objection';
import { sumBy } from 'lodash';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { InjectModelMeta } from '@/modules/Tenancy/TenancyModels/decorators/InjectModelMeta.decorator';
import { InjectModelDefaultViews } from '@/modules/Views/decorators/InjectModelDefaultViews.decorator';
import { ManualJournal } from '@/modules/ManualJournals/models/ManualJournal';
import { sanitizeSortDirection } from '@/modules/DynamicListing/DynamicFilter/sanitizeSortDirection';
import { ISearchRole } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';
import { RecurringJournalMeta } from './RecurringJournal.meta';
import { RecurringJournalDefaultViews } from '../constants';
import { RecurringJournalEntry } from './RecurringJournalEntry';
import {
  RecurringJournalFrequency,
  RecurringJournalStatus,
} from '../RecurringJournal.types';

@InjectModelMeta(RecurringJournalMeta)
@InjectModelDefaultViews(RecurringJournalDefaultViews)
export class RecurringJournal extends TenantBaseModel {
  public id: number;
  public profileName: string;
  public reference: string | null;
  public description: string | null;
  public journalType: string | null;
  public basis: string | null;

  public currencyCode: string | null;
  public exchangeRate: number;

  public branchId: number | null;
  public userId: number | null;

  public status: RecurringJournalStatus;
  public frequency: RecurringJournalFrequency;
  public repeatInterval: number;

  public startDate: string;
  public endDate: string | null;
  public maxOccurrences: number | null;
  public occurrencesCount: number;

  public nextJournalDate: string | null;
  public lastJournalDate: string | null;

  public autoPublish: boolean;

  public failureCount: number;
  public lastError: string | null;

  public createdAt: Date;
  public updatedAt: Date;

  public entries?: RecurringJournalEntry[];
  public journals?: ManualJournal[];

  /**
   * Table name.
   */
  static get tableName() {
    return 'recurring_journals';
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
    return ['isActive', 'isPaused', 'isCompleted', 'amount'];
  }

  get isActive(): boolean {
    return this.status === RecurringJournalStatus.Active;
  }

  get isPaused(): boolean {
    return this.status === RecurringJournalStatus.Paused;
  }

  get isCompleted(): boolean {
    return this.status === RecurringJournalStatus.Completed;
  }

  get amount(): number {
    return sumBy(this.entries || [], (entry) => Number(entry.debit) || 0);
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      active(query) {
        query.where('status', RecurringJournalStatus.Active);
      },
      paused(query) {
        query.where('status', RecurringJournalStatus.Paused);
      },
      completed(query) {
        query.where('status', RecurringJournalStatus.Completed);
      },
      due(query, today: string) {
        query.where('status', RecurringJournalStatus.Active);
        query.where('next_journal_date', '<=', today);
      },
      filterByStatus(query, status: string) {
        query.where('status', status);
      },
      sortByStatus(query, order) {
        const direction = sanitizeSortDirection(order);
        query.orderByRaw(
          `CASE status
            WHEN 'active' THEN 1
            WHEN 'paused' THEN 2
            WHEN 'completed' THEN 3
            ELSE 4
          END ${direction}`,
        );
      },
    };
  }

  /**
   * Relationship mappings.
   */
  static get relationMappings() {
    const {
      ManualJournal,
    } = require('../../../ManualJournals/models/ManualJournal');
    const { RecurringJournalEntry } = require('./RecurringJournalEntry');

    return {
      entries: {
        relation: Model.HasManyRelation,
        modelClass: RecurringJournalEntry,
        join: {
          from: 'recurring_journals.id',
          to: 'recurring_journal_entries.recurringJournalId',
        },
        filter(builder) {
          builder.orderBy('index', 'ASC');
        },
      },

      journals: {
        relation: Model.HasManyRelation,
        modelClass: ManualJournal,
        join: {
          from: 'recurring_journals.id',
          to: 'manual_journals.recurringJournalId',
        },
        filter(builder) {
          builder.orderBy('date', 'DESC');
        },
      },
    };
  }

  /**
   * Model searchable.
   */
  static get searchable() {
    return true;
  }

  /**
   * Model search roles.
   */
  static get searchRoles(): ISearchRole[] {
    return [{ fieldKey: 'profile_name', comparator: 'contains' }];
  }
}
