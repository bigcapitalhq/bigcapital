import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import { TrackingTag } from './TrackingTag';
import { TrackingTagOption } from './TrackingTagOption';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';

export class ItemEntryTrackingTag extends BaseModel {
  public itemEntryId!: number;
  public tagId!: number;
  public optionId!: number;

  public tag!: TrackingTag;
  public option!: TrackingTagOption;
  public itemEntry!: ItemEntry;

  static get tableName() {
    return 'item_entry_tracking_tags';
  }

  static get idColumn() {
    return ['itemEntryId', 'tagId'];
  }

  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get relationMappings() {
    const { TrackingTag } = require('./TrackingTag');
    const { TrackingTagOption } = require('./TrackingTagOption');
    const { ItemEntry } = require('../../TransactionItemEntry/models/ItemEntry');

    return {
      tag: {
        relation: Model.BelongsToOneRelation,
        modelClass: TrackingTag,
        join: {
          from: 'item_entry_tracking_tags.tagId',
          to: 'tracking_tags.id',
        },
      },
      option: {
        relation: Model.BelongsToOneRelation,
        modelClass: TrackingTagOption,
        join: {
          from: 'item_entry_tracking_tags.optionId',
          to: 'tracking_tag_options.id',
        },
      },
      itemEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemEntry,
        join: {
          from: 'item_entry_tracking_tags.itemEntryId',
          to: 'items_entries.id',
        },
      },
    };
  }
}
