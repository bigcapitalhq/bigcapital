import bcrypt from 'bcryptjs';
import TenantModel from 'models/TenantModel';

export default class TenantUser extends TenantModel {
  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['fullName'];
  }

  /**
   * Table name
   */
  static get tableName() {
    return 'users';
  }

  /**
   * Timestamps columns.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }
 
  /**
   * Verify the password of the user.
   * @param  {String} password - The given password.
   * @return {Boolean}
   */
  verifyPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  fullName() {
    return `${this.firstName} ${this.lastName || ''}`;
  }
}