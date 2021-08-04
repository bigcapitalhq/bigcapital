import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import { buildFilterQuery } from 'lib/ViewRolesBuilder';
import ItemSettings from './Item.Settings';
import ModelSetting from './ModelSetting';
import CustomViewBaseModel from './CustomViewBaseModel';
import { DEFAULT_VIEWS } from 'services/Items/constants';

export default class Item extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'items';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Allows to mark model as resourceable to viewable and filterable.
   */
  static get resourceable() {
    return true;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      sortBy(query, columnSort, sortDirection) {
        query.orderBy(columnSort, sortDirection);
      },
      viewRolesBuilder(query, conditions, logicExpression) {
        buildFilterQuery(Item.tableName, conditions, logicExpression)(query);
      },

      /**
       * Inactive/Active mode.
       */
      inactiveMode(query, active = false) {
        query.where('items.active', !active);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Media = require('models/Media');
    const Account = require('models/Account');
    const ItemCategory = require('models/ItemCategory');

    return {
      /**
       * Item may belongs to cateogory model.
       */
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemCategory.default,
        join: {
          from: 'items.categoryId',
          to: 'items_categories.id',
        },
      },

      costAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'items.costAccountId',
          to: 'accounts.id',
        },
      },

      sellAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'items.sellAccountId',
          to: 'accounts.id',
        },
      },

      inventoryAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'items.inventoryAccountId',
          to: 'accounts.id',
        },
      },

      media: {
        relation: Model.ManyToManyRelation,
        modelClass: Media.default,
        join: {
          from: 'items.id',
          through: {
            from: 'media_links.model_id',
            to: 'media_links.media_id',
          },
          to: 'media.id',
        },
      },
    };
  }

  /**
   * Model settings.
   */
  static get meta() {
    return ItemSettings;
  }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  static get defaultViews() {
    return DEFAULT_VIEWS;
  }
}
