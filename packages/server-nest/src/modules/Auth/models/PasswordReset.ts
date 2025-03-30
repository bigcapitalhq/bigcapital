import { SystemModel } from '@/modules/System/models/SystemModel';

export class PasswordReset extends SystemModel {
  readonly email: string;
  readonly token: string;

  readonly createdAt: Date;

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
