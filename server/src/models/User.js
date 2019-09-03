import bcrypt from 'bcryptjs';
import bookshelf from './bookshelf';

const User = bookshelf.Model.extend({

  /**
   * Table name
   */
  tableName: 'users',

  /**
   * Timestamp columns.
   */
  hasTimestamps: ['created_at', 'updated_at'],

  /**
   * Verify the password of the user.
   * @param  {String} password - The given password.
   * @return {Boolean}
   */
  verifyPassword(password) {
    return bcrypt.compareSync(password, this.get('password'));
  },
});

export default bookshelf.model('User', User);
