import { BaseModel } from '@/models/Model';
import { Model } from 'objection';

export class BillLandedCostEntry extends BaseModel {
  cost!: number;
  entryId!: number;
  billLocatedCostId!: number;

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
    const {
      ItemEntry,
    } = require('../../TransactionItemEntry/models/ItemEntry');

    return {
      itemEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemEntry,
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
