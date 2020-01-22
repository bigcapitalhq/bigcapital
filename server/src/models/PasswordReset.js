import Model from '@/models/Model';

export default class PasswordResets extends Model {
  /**
   * Table name
   */
  static get tableName() {
    return 'password_resets';
  }
}
