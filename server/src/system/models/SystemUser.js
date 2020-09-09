import { Model, mixin } from 'objection';
import bcrypt from 'bcryptjs';
import SoftDelete from 'objection-soft-delete';
import SystemModel from '@/system/models/SystemModel';
import moment from 'moment';

export default class SystemUser extends mixin(SystemModel, [SoftDelete({
  columnName: 'deleted_at',
  deletedValue: moment().format('YYYY-MM-DD HH:mm:ss'),
  notDeletedValue: null,
})]) {
  /**
   * Table name.
   */
  static get tableName() {
    return 'users';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Tenant = require('@/system/models/Tenant');

    return {
      /**
       * System user may belongs to tenant model.
       */
      tenant: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tenant.default,
        join: {
          from: 'users.tenantId',
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
