import SystemModel from '@/system/models/SystemModel';

export default class UserTenants extends SystemModel {
  user_id: number;
  tenant_id: number;

  /**
   * Table name.
   */
  static get tableName() {
    return 'user_tenants';
  }
}
