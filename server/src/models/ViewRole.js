import bookshelf from './bookshelf';

const ViewRole = bookshelf.Model.extend({
  /**
   * Table name.
   */
  tableName: 'view_roles',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,

  /**
   * View role model may belongs to view model.
   */
  view() {
    return this.belongsTo('View', 'view_id');
  },
});

export default bookshelf.model('ViewRole', ViewRole);
