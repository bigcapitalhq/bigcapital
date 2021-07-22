import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class BillLandedCost extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'bill_located_costs';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const BillLandedCostEntry = require('models/BillLandedCostEntry');
    const Bill = require('models/Bill');

    return {
      bill: {
        relation: Model.BelongsToOneRelation,
        modelClass: Bill.default,
        join: {
          from: 'bill_located_costs.billId',
          to: 'bills.id',
        },
      },
      allocateEntries: {
        relation: Model.HasManyRelation,
        modelClass: BillLandedCostEntry.default,
        join: {
          from: 'bill_located_costs.id',
          to: 'bill_located_cost_entries.billLocatedCostId',
        },
      },
    };
  }
}
