import { mixin, Model, raw } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSearchable from './ModelSearchable';
import SoftDeleteQueryBuilder from '@/collection/SoftDeleteQueryBuilder';

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
