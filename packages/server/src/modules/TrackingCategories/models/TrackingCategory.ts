import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import type { TrackingCategoryOption } from './TrackingCategoryOption';

export class TrackingCategory extends BaseModel {
  public name!: string;
  public description!: string | null;
  public active!: boolean;
  public mandatory!: boolean;

  public options?: TrackingCategoryOption[];

  public createdAt?: Date;
  public updatedAt?: Date;

  /**
   * Table name.
   */
  static get tableName() {
    return 'tracking_categories';
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
    const { TrackingCategoryOption } = require('./TrackingCategoryOption');

    return {
      options: {
        relation: Model.HasManyRelation,
        modelClass: TrackingCategoryOption,
        join: {
          from: 'tracking_categories.id',
          to: 'tracking_category_options.categoryId',
        },
        filter(query) {
          query.orderBy('name', 'asc');
        },
      },
    };
  }
}
