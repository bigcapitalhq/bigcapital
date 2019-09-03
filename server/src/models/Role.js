import bookshelf from './bookshelf';

const Role = bookshelf.Model.extend({

  /**
   * Table name of Role model.
   * @type {String}
   */
  tableName: 'roles',

  /**
   * Timestamp columns.
   */
  hasTimestamps: false,

  /**
   * Role may has many permissions.
   */
  permissions() {
    return this.belongsToMany('Permission', 'role_has_permissions', 'role_id', 'permission_id');
  },

  /**
   * Role model may has many users.
   */
  users() {
    return this.belongsTo('User');
  },
});

export default bookshelf.model('Role', Role);
