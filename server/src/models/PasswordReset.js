import bookshelf from './bookshelf';

const PasswordResets = bookshelf.Model.extend({

  /**
   * Table name
   */
  tableName: 'password_resets',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,
});

export default bookshelf.model('PasswordResets', PasswordResets);
