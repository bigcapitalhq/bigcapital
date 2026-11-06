import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import type { TrackingCategory } from '@/modules/TrackingCategories/models/TrackingCategory';
import type { TrackingCategoryOption } from '@/modules/TrackingCategories/models/TrackingCategoryOption';

export class RecurringJournalEntryTrackingCategory extends BaseModel {
  public recurringJournalEntryId!: number;
  public categoryId!: number;
  public optionId!: number;

  public category?: TrackingCategory;
  public option?: TrackingCategoryOption;

  public createdAt?: Date;
  public updatedAt?: Date;

  /**
   * Table name.
   */
  static get tableName() {
    return 'recurring_journal_entry_tracking_categories';
  }

  /**
   * Composite primary key columns.
   */
  static get idColumn() {
    return ['recurringJournalEntryId', 'categoryId'];
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const {
      TrackingCategory,
    } = require('../../../TrackingCategories/models/TrackingCategory');
    const {
      TrackingCategoryOption,
    } = require('../../../TrackingCategories/models/TrackingCategoryOption');
    const { RecurringJournalEntry } = require('./RecurringJournalEntry');

    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: TrackingCategory,
        join: {
          from: 'recurring_journal_entry_tracking_categories.categoryId',
          to: 'tracking_categories.id',
        },
      },
      option: {
        relation: Model.BelongsToOneRelation,
        modelClass: TrackingCategoryOption,
        join: {
          from: 'recurring_journal_entry_tracking_categories.optionId',
          to: 'tracking_category_options.id',
        },
      },
      recurringJournalEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: RecurringJournalEntry,
        join: {
          from: 'recurring_journal_entry_tracking_categories.recurringJournalEntryId',
          to: 'recurring_journal_entries.id',
        },
      },
    };
  }
}
