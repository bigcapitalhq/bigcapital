import SystemModel from '@/system/models/SystemModel';

export default class UserInvite extends SystemModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'user_invites';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt'];
  }
}
