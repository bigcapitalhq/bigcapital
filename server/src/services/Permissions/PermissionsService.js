import cache from 'memory-cache';
import { difference } from 'lodash';
import Role from '@/models/Role';

export default {
  cacheKey: 'ratteb.cache,',
  cacheExpirationTime: null,
  permissions: [],
  cache: null,

  /**
   * Initialize the cache.
   */
  initializeCache() {
    if (!this.cache) {
      this.cache = new cache.Cache();
    }
  },

  /**
   * Purge all cached permissions.
   */
  forgetCachePermissions() {
    this.cache.del(this.cacheKey);
    this.permissions = [];
  },

  /**
   * Get all stored permissions.
   */
  async getPermissions() {
    if (this.permissions.length <= 0) {
      const cachedPerms = this.cache.get(this.cacheKey);

      if (!cachedPerms) {
        this.permissions = await this.getPermissionsFromStorage();
        this.cache.put(this.cacheKey, this.permissions);
      } else {
        this.permissions = cachedPerms;
      }
    }
    return this.permissions;
  },

  /**
   * Fetches all roles and permissions from the storage.
   */
  async getPermissionsFromStorage() {
    const roles = await Role.fetchAll({
      withRelated: ['resources.permissions'],
    });
    return roles.toJSON();
  },

  /**
   * Detarmine the given resource has the permissions.
   * @param {String} resource -
   * @param {Array} permissions -
   */
  async hasPermissions(resource, permissions) {
    await this.getPermissions();

    const userRoles = this.permissions.filter((role) => role.id === this.id);
    const perms = [];

    userRoles.forEach((role) => {
      const roleResources = role.resources || [];
      const foundResource = roleResources.find((r) => r.name === resource);

      if (foundResource && foundResource.permissions) {
        foundResource.permissions.forEach((p) => perms.push(p.name));
      }
    });
    const notAllowedPerms = difference(permissions, perms);
    return (notAllowedPerms.length <= 0);
  },
};
