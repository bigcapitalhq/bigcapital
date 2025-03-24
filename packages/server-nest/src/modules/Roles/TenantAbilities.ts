import { Ability } from '@casl/ability';
import LruCache from 'lru-cache';
import { Role } from './models/Role.model';
import { RolePermission } from './models/RolePermission.model';

// store abilities of 1000 most active users
export const ABILITIES_CACHE = new LruCache(1000);

/**
 * Retrieve ability for the given role.
 * @param {} role
 * @returns
 */
export function getAbilityForRole(role) {
  const rules = getAbilitiesRolesConds(role);
  return new Ability(rules);
}

/**
 * Retrieve abilities of the given role.
 * @param {IRole} role
 * @returns {}
 */
function getAbilitiesRolesConds(role: Role) {
  switch (role.slug) {
    case 'admin': // predefined role.
      return getSuperAdminRules();
    default:
      return getRulesFromRolePermissions(role.permissions || []);
  }
}

/**
 * Retrieve the super admin rules.
 * @returns {}
 */
function getSuperAdminRules() {
  return [{ action: 'manage', subject: 'all' }];
}

/**
 * Retrieve CASL rules from role permissions.
 * @param {RolePermission[]} permissions -
 * @returns {}
 */
function getRulesFromRolePermissions(permissions: RolePermission[]) {
  return permissions
    .filter((permission: RolePermission) => permission.value)
    .map((permission: RolePermission) => {
      return {
        action: permission.ability,
        subject: permission.subject,
      };
    });
}