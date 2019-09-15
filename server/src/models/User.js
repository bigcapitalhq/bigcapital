import bcrypt from 'bcryptjs';
import bookshelf from './bookshelf';
import PermissionsService from '@/services/PermissionsService';

const User = bookshelf.Model.extend({
  ...PermissionsService,

  /**
   * Table name
   */
  tableName: 'users',

  /**
   * Timestamp columns.
   */
  hasTimestamps: ['created_at', 'updated_at'],

  initialize() {
    this.initializeCache();
  },

  /**
   * Verify the password of the user.
   * @param  {String} password - The given password.
   * @return {Boolean}
   */
  verifyPassword(password) {
    return bcrypt.compareSync(password, this.get('password'));
  },

  /**
   * User model may has many associated roles.
   */
  roles() {
    return this.belongsToMany('Role', 'user_has_roles', 'user_id', 'role_id');
  },
});

export default bookshelf.model('User', User);
