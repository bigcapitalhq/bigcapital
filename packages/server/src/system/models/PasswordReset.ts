import SystemModel from '@/system/models/SystemModel';

export default class PasswordResets extends SystemModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'password_resets';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt'];
  }
}
