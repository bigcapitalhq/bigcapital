import TenantModel from 'models/TenantModel';
import { Model } from 'objection';

export default class SaleEstimateEntry extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'sales_estimate_entries';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const SaleEstimate = require('models/SaleEstimate');

    return {
      estimate: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleEstimate.default,
        join: {
          from: 'sales_estimates.id',
          to: 'sales_estimate_entries.estimate_id',
        },
      },
    };
  }
}
