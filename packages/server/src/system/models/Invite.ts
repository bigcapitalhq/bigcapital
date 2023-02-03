import SystemModel from '@/system/models/SystemModel';
import moment from 'moment';

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

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      notExpired(query) {
        const comp = moment().subtract(24, 'hours').toMySqlDateTime();
        query.where('created_at', '>=', comp);
      }
    }
  }
}
