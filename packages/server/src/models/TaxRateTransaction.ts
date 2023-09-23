import { mixin, Model, raw } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSearchable from './ModelSearchable';

export default class TaxRateTransaction extends mixin(TenantModel, [
  ModelSearchable,
]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'tax_rate_transactions';
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

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {};
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const TaxRate = require('models/TaxRate');

    return {
      /**
       * Belongs to the tax rate.
       */
      taxRate: {
        relation: Model.BelongsToOneRelation,
        modelClass: TaxRate.default,
        join: {
          from: 'tax_rate_transactions.taxRateId',
          to: 'tax_rates.id',
        },
      },
    };
  }
}
