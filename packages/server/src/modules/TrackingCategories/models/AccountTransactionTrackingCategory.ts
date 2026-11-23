import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import type { TrackingCategory } from './TrackingCategory';
import type { TrackingCategoryOption } from './TrackingCategoryOption';

export class AccountTransactionTrackingCategory extends BaseModel {
  public accountTransactionId!: number;
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
    return 'account_transaction_tracking_categories';
  }

  /**
   * Composite primary key columns.
   */
  static get idColumn() {
    return ['accountTransactionId', 'categoryId'];
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
    const { TrackingCategoryOption } = require('./TrackingCategoryOption');

    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: TrackingCategory,
        join: {
          from: 'account_transaction_tracking_categories.categoryId',
          to: 'tracking_categories.id',
        },
      },
      option: {
        relation: Model.BelongsToOneRelation,
        modelClass: TrackingCategoryOption,
        join: {
          from: 'account_transaction_tracking_categories.optionId',
          to: 'tracking_category_options.id',
        },
      },
    };
  }
}
