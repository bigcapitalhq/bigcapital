import bookshelf from './bookshelf';

const ViewColumn = bookshelf.Model.extend({
  /**
   * Table name.
   */
  tableName: 'view_columns',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,

  view() {

  }
});

export default bookshelf.model('ViewColumn', ViewColumn);
