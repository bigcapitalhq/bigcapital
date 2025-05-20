import moment from 'moment';
import { BaseModel } from '@/models/Model';

export class UserInvite extends BaseModel {
  token!: string;
  userId!: number;
  tenantId!: number;
  email!: string;

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
      },
    };
  }
}
