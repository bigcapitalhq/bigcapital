import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import type { TrackingCategory } from './TrackingCategory';

export class TrackingCategoryOption extends BaseModel {
  public categoryId!: number;
  public name!: string;
  public active!: boolean;

  public category?: TrackingCategory;

  public createdAt?: Date;
  public updatedAt?: Date;

  /**
   * Table name.
   */
  static get tableName() {
    return 'tracking_category_options';
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
    const { TrackingCategory } = require('./TrackingCategory');

    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: TrackingCategory,
        join: {
          from: 'tracking_category_options.categoryId',
          to: 'tracking_categories.id',
        },
      },
    };
  }
}
