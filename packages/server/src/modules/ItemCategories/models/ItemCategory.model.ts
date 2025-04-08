import { ExportableModel } from '@/modules/Export/decorators/ExportableModel.decorator';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { Model } from 'objection';

@ExportableModel()
export class ItemCategory extends TenantBaseModel {
  name!: string;
  description!: string;

  costAccountId!: number;
  sellAccountId!: number;
  inventoryAccountId!: number;

  userId!: number;

  /**
   * Table name.
   */
  static get tableName() {
    return 'items_categories';
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
    const { Item } = require('../../Items/models/Item');

    return {
      /**
       * Item category may has many items.
       */
      items: {
        relation: Model.HasManyRelation,
        modelClass: Item,
        join: {
          from: 'items_categories.id',
          to: 'items.categoryId',
        },
      },
    };
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Inactive/Active mode.
       */
      sortByCount(query, order = 'asc') {
        query.orderBy('count', order);
      },
    };
  }

  /**
   * Model meta.
   */
  // static get meta() {
  // return ItemCategorySettings;
  // }
}
