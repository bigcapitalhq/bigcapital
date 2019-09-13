import bookshelf from './bookshelf';

const View = bookshelf.Model.extend({
  /**
   * Table name.
   */
  tableName: 'views',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,

  /**
   * View model belongs to resource model.
   */
  resource() {
    return this.belongsTo('Resource', 'resource_id');
  },

  /**
   * View model may has many columns.
   */
  columns() {
    return this.belongsToMany('ResourceField', 'view_has_columns', 'view_id', 'field_id');
  },

  /**
   * View model may has many view roles.
   */
  viewRoles() {
    return this.hasMany('ViewRole', 'view_id');
  },
}, {
  dependents: ['columns', 'viewRoles'],
});

export default bookshelf.model('View', View);
