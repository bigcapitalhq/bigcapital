import { Model } from 'objection';
import bcrypt from 'bcryptjs';
import SystemModel from '@/system/models/SystemModel';
import SoftDeleteQueryBuilder from '@/collection/SoftDeleteQueryBuilder';

export default class SystemUser extends SystemModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'users';
  }

  /**
   * Soft delete query builder.
   */
  static get QueryBuilder() {
    return SoftDeleteQueryBuilder;
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['fullName', 'isDeleted', 'isInviteAccepted'];
  }

  /**
   * 
   */
  get isDeleted() {
    return !!this.deletedAt;
  }

  /**
   * 
   */
  get isInviteAccepted() {
    return !!this.inviteAcceptedAt;
  }

  /**
   * Full name attribute.
   */
  get fullName() {
    return (this.firstName + ' ' + this.lastName).trim();
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Tenant = require('system/models/Tenant');

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
