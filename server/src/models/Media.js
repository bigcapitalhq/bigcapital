import TenantModel from 'models/TenantModel';

export default class Media extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'media';
  }
}
