import bookshelf from './bookshelf';

const Setting = bookshelf.Model.extend({

  /**
   * Table name
   */
  tableName: 'settings',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,
});

export default bookshelf.model('Setting', Setting);
