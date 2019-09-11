import bookshelf from './bookshelf';

const Permission = bookshelf.Model.extend({

  /**
   * Table name of Role model.
   * @type {String}
   */
  tableName: 'permissions',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,

  role() {
    return this.belongsTo('Role', 'role_id');
  },

  resource() {
    return this.belongsTo('Resource', 'resource_id');
  },
});

export default bookshelf.model('Permission', Permission);
