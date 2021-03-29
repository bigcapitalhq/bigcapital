import { Model, raw } from 'objection';
import moment from 'moment';
import TenantModel from 'models/TenantModel';

export default class InventoryTransaction extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'inventory_transactions';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
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

      itemsTotals(builder) {
        builder.select('itemId');
        builder.sum('rate as rate');
        builder.sum('quantity as quantity');
        builder.select(raw('SUM(`QUANTITY` * `RATE`) as COST'));
        builder.groupBy('itemId');
      },

      INDirection(builder) {
        builder.where('direction', 'IN');
      },

      OUTDirection(builder) {
        builder.where('direction', 'OUT');
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Item = require('models/Item');
    const ItemEntry = require('models/ItemEntry');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item.default,
        join: {
          from: 'inventory_transactions.itemId',
          to: 'items.id',
        },
      },
      itemEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'inventory_transactions.entryId',
          to: 'items_entries.id',
        },
      }
    };
  }
}
