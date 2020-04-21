import BaseModel from '@/models/Model';

export default class Tenant extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'tenants';
  }
}
