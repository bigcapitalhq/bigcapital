import { Model } from 'objection';
import bcrypt from 'bcryptjs';
import SystemModel from '@/system/models/SystemModel';
import SoftDeleteQueryBuilder from '@/collection/SoftDeleteQueryBuilder';

export default class SystemUser extends SystemModel {
  firstName!: string;
  lastName!: string;
  verified!: boolean;
  inviteAcceptedAt!: Date | null;
  deletedAt!: Date | null;

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
    return ['fullName', 'isDeleted', 'isInviteAccepted', 'isVerified'];
  }

  /**
   * Detarmines whether the user is deleted.
   * @returns {boolean}
   */
  get isDeleted() {
    return !!this.deletedAt;
  }

  /**
   * Detarmines whether the sent invite is accepted.
   * @returns {boolean}
   */
  get isInviteAccepted() {
    return !!this.inviteAcceptedAt;
  }

  /**
   * Detarmines whether the user's email is verified.
   * @returns {boolean}
   */
  get isVerified() {
    return !!this.verified;
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
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Filters the invite accepted users.
       */
      inviteAccepted(query) {
        query.whereNotNull('invite_accepted_at');
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
