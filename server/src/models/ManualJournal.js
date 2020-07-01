import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

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
    const Media = require('@/models/Media');

    return {
      media: {
        relation: Model.ManyToManyRelation,
        modelClass: this.relationBindKnex(Media.default),
        join: {
          from: 'manual_journals.id',
          through: {
            from: 'media_links.model_id',
            to: 'media_links.media_id',
          },
          to: 'media.id',
        }
      }
    };
  }
}
