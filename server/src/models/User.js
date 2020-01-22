import bcrypt from 'bcryptjs';
import { Model } from 'objection';
import BaseModel from '@/models/Model';
// import PermissionsService from '@/services/PermissionsService';

export default class User extends BaseModel {
  // ...PermissionsService

  /**
   * Table name
   */
  static get tableName() {
    return 'users';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Role = require('@/models/Role');

    return {
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role.default,
        join: {
          from: 'users.id',
          through: {
            from: 'user_has_roles.userId',
            to: 'user_has_roles.roleId',
          },
          to: 'roles.id',
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
