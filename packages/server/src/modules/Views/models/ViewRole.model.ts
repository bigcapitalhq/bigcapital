import { BaseModel } from '@/models/Model';
import { Model } from 'objection';

export class ViewRole extends BaseModel {
  index: number;
  fieldKey: string;
  comparator: string;
  value: string;

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['comparators'];
  }

  static get comparators() {
    return ['equals', 'not_equal', 'contains', 'not_contain'];
  }

  /**
   * Table name.
   */
  static get tableName() {
    return 'view_roles';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const View = require('./View.model');

    return {
      /**
       * View role model may belongs to view model.
       */
      view: {
        relation: Model.BelongsToOneRelation,
        modelClass: View.default,
        join: {
          from: 'view_roles.viewId',
          to: 'views.id',
        },
      },
    };
  }
}
