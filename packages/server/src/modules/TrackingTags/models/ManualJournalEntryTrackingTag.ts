import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import { TrackingTag } from './TrackingTag';
import { TrackingTagOption } from './TrackingTagOption';
import { ManualJournalEntry } from '@/modules/ManualJournals/models/ManualJournalEntry';

export class ManualJournalEntryTrackingTag extends BaseModel {
  public manualJournalEntryId!: number;
  public tagId!: number;
  public optionId!: number;

  public tag!: TrackingTag;
  public option!: TrackingTagOption;
  public manualJournalEntry!: ManualJournalEntry;

  static get tableName() {
    return 'manual_journal_entry_tracking_tags';
  }

  static get idColumn() {
    return ['manualJournalEntryId', 'tagId'];
  }

  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get relationMappings() {
    const { TrackingTag } = require('./TrackingTag');
    const { TrackingTagOption } = require('./TrackingTagOption');
    const { ManualJournalEntry } = require('../../ManualJournals/models/ManualJournalEntry');

    return {
      tag: {
        relation: Model.BelongsToOneRelation,
        modelClass: TrackingTag,
        join: {
          from: 'manual_journal_entry_tracking_tags.tagId',
          to: 'tracking_tags.id',
        },
      },
      option: {
        relation: Model.BelongsToOneRelation,
        modelClass: TrackingTagOption,
        join: {
          from: 'manual_journal_entry_tracking_tags.optionId',
          to: 'tracking_tag_options.id',
        },
      },
      manualJournalEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ManualJournalEntry,
        join: {
          from: 'manual_journal_entry_tracking_tags.manualJournalEntryId',
          to: 'manual_journals_entries.id',
        },
      },
    };
  }
}
