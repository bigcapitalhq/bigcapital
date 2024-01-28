import BaseModel from 'models/Model';

export default class TenantMetadata extends BaseModel {
  baseCurrency: string;

  /**
   * Table name.
   */
  static get tableName() {
    return 'tenants_metadata';
  }
}
