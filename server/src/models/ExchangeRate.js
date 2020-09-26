import bcrypt from 'bcryptjs';
import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class ExchangeRate extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'exchange_rates';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }
}