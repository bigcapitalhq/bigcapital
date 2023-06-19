import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Ability } from '@casl/ability';
import LruCache from 'lru-cache';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { IRole, IRolePermission, ISystemUser } from '@/interfaces';

// store abilities of 1000 most active users
export const ABILITIES_CACHE = new LruCache(1000);

/**
 * Retrieve ability for the given role.
 * @param {} role
 * @returns
 */
function getAbilityForRole(role) {
  const rules = getAbilitiesRolesConds(role);
  return new Ability(rules);
}

/**
 * Retrieve abilities of the given role.
 * @param {IRole} role
 * @returns {}
 */
function getAbilitiesRolesConds(role: IRole) {
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
 * @param {IRolePermission[]} permissions -
 * @returns {}
 */
function getRulesFromRolePermissions(permissions: IRolePermission[]) {
  return permissions
    .filter((permission: IRolePermission) => permission.value)
    .map((permission: IRolePermission) => {
      return {
        action: permission.ability,
        subject: permission.subject,
      };
    });
}

/**
 * Retrieve ability for user.
 * @param {ISystemUser} user
 * @param {number} tenantId
 * @returns {}
 */
async function getAbilityForUser(user: ISystemUser, tenantId: number) {
  const tenancy = Container.get(HasTenancyService);
  const { User } = tenancy.models(tenantId);

  const tenantUser = await User.query()
    .findOne('systemUserId', user.id)
    .withGraphFetched('role.permissions');

  return getAbilityForRole(tenantUser.role);
}

/**
 *
 * @param {Request} request -
 * @param {Response} response -
 * @param {NextFunction} next -
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  const { tenantId, user } = req;

  if (ABILITIES_CACHE.has(req.user.id)) {
    req.ability = ABILITIES_CACHE.get(req.user.id);
  } else {
    req.ability = await getAbilityForUser(req.user, tenantId);
    ABILITIES_CACHE.set(req.user.id, req.ability);
  }
  next();
};
