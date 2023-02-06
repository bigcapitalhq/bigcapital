import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class BillLandedCostEntry extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'bill_located_cost_entries';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const ItemEntry = require('models/ItemEntry');

    return {
      itemEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'bill_located_cost_entries.entryId',
          to: 'items_entries.id',
        },
        filter(builder) {
          builder.where('reference_type', 'Bill');
        },
      },
    };
  }
}
