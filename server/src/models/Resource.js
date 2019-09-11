import bookshelf from './bookshelf';

const Resource = bookshelf.Model.extend({
  /**
   * Table name.
   */
  tableName: 'resources',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,

  permissions() {
  },

  roles() {
  },
});

export default bookshelf.model('Resource', Resource);
