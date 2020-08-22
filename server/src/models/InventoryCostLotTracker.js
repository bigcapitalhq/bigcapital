import { Model } from 'objection';
import moment from 'moment';
import TenantModel from '@/models/TenantModel';

export default class InventoryCostLotTracker extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'inventory_cost_lot_tracker';
  }

  /**
   * Model timestamps.
   */
  static get timestamps() {
    return [];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      filterDateRange(query, startDate, endDate, type = 'day') {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const fromDate = moment(startDate).startOf(type).format(dateFormat);
        const toDate = moment(endDate).endOf(type).format(dateFormat);

        if (startDate) {
          query.where('date', '>=', fromDate);
        }
        if (endDate) {
          query.where('date', '<=', toDate);
        }
      },
    };
  }


  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Item = require('@/models/Item');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Item.default),
        join: {
          from: 'inventory_cost_lot_tracker.itemId',
          to: 'items.id',
        },
      },
    };
  }
}
