import { mixin, Model, raw } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSearchable from './ModelSearchable';

export default class TaxRate extends mixin(TenantModel, [ModelSearchable]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'tax_rates';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
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
    return {};
  }
}
