import TenantModel from '@/models/TenantModel';

export default class PasswordResets extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'password_resets';
  }
}
