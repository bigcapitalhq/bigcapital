import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import { TrackingTag } from './TrackingTag';

export class TrackingTagOption extends BaseModel {
  public tagId!: number;
  public name!: string;
  public active!: boolean;

  public tag!: TrackingTag;

  static get tableName() {
    return 'tracking_tag_options';
  }

  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get relationMappings() {
    const { TrackingTag } = require('./TrackingTag');

    return {
      tag: {
        relation: Model.BelongsToOneRelation,
        modelClass: TrackingTag,
        join: {
          from: 'tracking_tag_options.tagId',
          to: 'tracking_tags.id',
        },
      },
    };
  }
}
