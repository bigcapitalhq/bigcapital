import path from 'path';
import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class ItemEntry extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'items_entries';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  static get virtualAttributes() {
    return ['amount'];
  }

  get amount() {
    return ItemEntry.calcAmount(this);
  }

  static calcAmount(itemEntry) {
    const { discount, quantity, rate } = itemEntry;
    const total = quantity * rate;

    return discount ? total - (total * discount * 0.01) : total;
  }

  static get relationMappings() {
    const Item = require('models/Item');
    const BillLandedCostEntry = require('models/BillLandedCostEntry');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item.default,
        join: {
          from: 'items_entries.itemId',
          to: 'items.id',
        },
      },
      allocatedCostEntries: {
        relation: Model.HasManyRelation,
        modelClass: BillLandedCostEntry.default,
        join: {
          from: 'items_entries.referenceId',
          to: 'bill_located_cost_entries.entryId',
        },
      },
    };
  }
}
