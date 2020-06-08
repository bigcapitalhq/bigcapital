import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class Customer extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'customers';
  }
}
