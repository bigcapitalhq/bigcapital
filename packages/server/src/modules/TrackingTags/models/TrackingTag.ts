import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { TrackingTagOption } from './TrackingTagOption';

export class TrackingTag extends TenantBaseModel {
  public name!: string;
  public description!: string | null;
  public active!: boolean;

  public options!: TrackingTagOption[];

  static get tableName() {
    return 'tracking_tags';
  }

  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get relationMappings() {
    const { TrackingTagOption } = require('./TrackingTagOption');

    return {
      options: {
        relation: Model.HasManyRelation,
        modelClass: TrackingTagOption,
        join: {
          from: 'tracking_tags.id',
          to: 'tracking_tag_options.tagId',
        },
        filter(query) {
          query.where('active', true);
        },
      },
    };
  }
}
