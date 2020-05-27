import { Model, mixin } from 'objection';
import bcrypt from 'bcryptjs';
import SystemModel from '@/system/models/SystemModel';
import DateSession from '@/models/DateSession';
import UserSubscription from '@/services/Subscription/UserSubscription';


export default class SystemUser extends mixin(SystemModel, [DateSession, UserSubscription]) {
  /**
   * Table name.
   */
  static get tableName() {
    return 'users';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Tenant = require('@/system/models/Tenant');
    const SubscriptionUsage = require('@/system/models/SubscriptionUsage');

    return {
      tenant: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tenant.default,
        join: {
          from: 'users.tenantId',
          to: 'tenants.id',
        },
      },

      subscriptionUsage: {
        relation: Model.BelongsToOneRelation,
        modelClass: SubscriptionUsage.default,
        join: {
          from: 'users.id',
          to: 'subscriptions_usage.user_id',
        }
      },
    };
  }

  /**
   * Verify the password of the user.
   * @param  {String} password - The given password.
   * @return {Boolean}
   */
  verifyPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}
