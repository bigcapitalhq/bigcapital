import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class Vendor extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'vendors';
  }
}
