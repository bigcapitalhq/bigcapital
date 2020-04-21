import { Model } from 'objection';
import bcrypt from 'bcryptjs';
import SystemModel from '@/system/models/SystemModel';

export default class SystemUser extends SystemModel {
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

    return {
      tenant: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tenant.default,
        join: {
          from: 'users.tenant_id',
          to: 'tenants.id',
        },
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
