import BaseModel from 'models/Model';

export default class TenantMetadata extends BaseModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'tenants_metadata';
  }
}
