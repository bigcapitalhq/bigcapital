import SoftDeleteQueryBuilder from '@/collection/SoftDeleteQueryBuilder';
import TenantModel from 'models/TenantModel';
import { mixin } from 'objection';
import ModelSearchable from './ModelSearchable';

export default class TaxRate extends mixin(TenantModel, [ModelSearchable]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'tax_rates';
  }

  /**
   * Soft delete query builder.
   */
  static get QueryBuilder() {
    return SoftDeleteQueryBuilder;
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
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
