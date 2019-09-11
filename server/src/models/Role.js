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
   * Role may has many resources.
   */
  resources() {
    return this.belongsToMany('Resource', 'role_has_permissions', 'role_id', 'resource_id');
  },

  /**
   * Role model may has many users.
   */
  users() {
    return this.belongsToMany('User', 'user_has_roles');
  },
});

export default bookshelf.model('Role', Role);
