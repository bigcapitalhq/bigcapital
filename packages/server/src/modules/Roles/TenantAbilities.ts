import { Ability } from '@casl/ability';
import * as LruCache from 'lru-cache';
import { Role } from './models/Role.model';
import { RolePermission } from './models/RolePermission.model';

interface AbilityCache {
  get: (userId: number) => Ability | undefined;
  set: (userId: number, ability: Ability) => void;
  del: (userId: number) => void;
}

interface TenantAbilitiesCache {
  get: (organizationId: string) => AbilityCache | undefined;
  set: (organizationId: string, cache: AbilityCache) => void;
  del: (organizationId: string) => void;
}

const MAX_USERS_PER_TENANT = 1000;

// Stores the abilities of 1000 most active users per tenant, for up to 1000 tenants.
const TENANT_ABILITIES_CACHE = new LruCache(1000) as TenantAbilitiesCache;

/**
 * Retrieves the abilities cache of the given tenant.
 * @param {string} organizationId - Tenant organization id.
 * @returns {AbilityCache}
 */
function getTenantAbilitiesCache(organizationId: string): AbilityCache {
  let cache = TENANT_ABILITIES_CACHE.get(organizationId);

  if (!cache) {
    cache = new LruCache(MAX_USERS_PER_TENANT) as AbilityCache;
    TENANT_ABILITIES_CACHE.set(organizationId, cache);
  }
  return cache;
}

/**
 * Retrieves the cached ability of the given tenant user.
 * @param {string} organizationId - Tenant organization id.
 * @param {number} userId - System user id.
 * @returns {Ability | undefined}
 */
export function getCachedAbility(
  organizationId: string,
  userId: number,
): Ability | undefined {
  return getTenantAbilitiesCache(organizationId).get(userId);
}

/**
 * Caches the ability of the given tenant user.
 * @param {string} organizationId - Tenant organization id.
 * @param {number} userId - System user id.
 * @param {Ability} ability - CASL ability.
 */
export function cacheAbility(
  organizationId: string,
  userId: number,
  ability: Ability,
): void {
  getTenantAbilitiesCache(organizationId).set(userId, ability);
}

/**
 * Purges the cached ability of the given tenant user.
 * @param {string} organizationId - Tenant organization id.
 * @param {number} userId - System user id.
 */
export function purgeUserAbility(organizationId: string, userId: number): void {
  TENANT_ABILITIES_CACHE.get(organizationId)?.del(userId);
}

/**
 * Purges all cached abilities of the given tenant in O(1).
 * @param {string} organizationId - Tenant organization id.
 */
export function purgeTenantAbilities(organizationId: string): void {
  TENANT_ABILITIES_CACHE.del(organizationId);
}

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
