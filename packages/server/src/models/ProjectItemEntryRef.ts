import { mixin, Model } from 'objection';
import TenantModel from 'models/TenantModel';
import CustomViewBaseModel from './CustomViewBaseModel';
import ModelSetting from './ModelSetting';
import ModelSearchable from './ModelSearchable';

export default class ProjectItemEntryRef extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'projects_item_entries_links';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return [];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [];
  }

  static get relationMappings() {
    const ItemEntry = require('models/ItemEntry');

    return {
      itemEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'projects_item_entries_links.itemEntryId',
          to: 'items_entries.id',
        },
      },
    };
  }
}
