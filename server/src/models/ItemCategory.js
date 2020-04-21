import path from 'path';
import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class ItemCategory extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'items_categories';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Item = require('@/models/Item');

    return {
      /**
       * Item category may has many items.
       */
      items: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(Item.default),
        join: {
          from: 'items_categories.id',
          to: 'items.categoryId',
        },
      },
    };
  }
}
