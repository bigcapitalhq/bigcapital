import bookshelf from './bookshelf';

const Account = bookshelf.Model.extend({

  /**
   * Table name
   */
  tableName: 'accounts',

  /**
   * Timestamp columns.
   */
  hasTimestamps: ['created_at', 'updated_at'],
});

export default bookshelf.model('Account', Account);
