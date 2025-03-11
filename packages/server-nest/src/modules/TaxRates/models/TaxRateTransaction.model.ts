import { mixin, Model, raw } from 'objection';
// import TenantModel from 'models/TenantModel';
// import ModelSearchable from './ModelSearchable';
import { BaseModel } from '@/models/Model';

export class TaxRateTransaction extends BaseModel {
  id: number;
  taxRateId: number;
  referenceType: string;
  referenceId: number;
  rate: number;
  taxAccountId: number;
  
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
    const { TaxRateModel } = require('./TaxRate.model');

    return {
      /**
       * Belongs to the tax rate.
       */
      taxRate: {
        relation: Model.BelongsToOneRelation,
        modelClass: TaxRateModel,
        join: {
          from: 'tax_rate_transactions.taxRateId',
          to: 'tax_rates.id',
        },
      },
    };
  }
}
