import { Ability } from '@casl/ability';
import { HttpStatus } from '@nestjs/common';
import { ModelObject } from 'objection';
import { ServiceError } from '@/modules/Items/ServiceError';
import { getRoleAbilityRules } from '@/modules/Roles/TenantAbilities';
import { Role } from '@/modules/Roles/models/Role.model';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantUser } from '@/modules/Tenancy/TenancyModels/models/TenantUser.model';
import { ERRORS } from './Users.constants';

/**
 * Validates the authorized user ability can assign the given role.
 *
 * A user should never be able to grant (through an invite or an edit) a role
 * that carries permissions the user does not hold themselves, otherwise the
 * role assignment becomes a privilege escalation vector.
 *
 * @param {Ability} ability - The authorized user ability.
 * @param {Role} role - The role that is about to be assigned.
 * @throws {ServiceError}
 */
export function validateAbilityCanAssignRole(
  ability: Ability,
  role: Pick<Role, 'slug' | 'permissions'>,
): void {
  const roleRules = getRoleAbilityRules(role as Role);

  const canAssignEveryRule = roleRules.every((rule) =>
    ability.can(rule.action, rule.subject),
  );

  if (!canAssignEveryRule) {
    throw new ServiceError(
      ERRORS.CANNOT_ASSIGN_ROLE_WITH_HIGHER_PRIVILEGES,
      'You cannot assign a role with higher privileges than yours.',
      null,
      HttpStatus.FORBIDDEN,
    );
  }
}

/**
 * Determines whether the given tenant user is the owner of the current
 * workspace. The workspace ownership is stored on the system `USER_TENANTS`
 * membership table.
 *
 * @param {TenantUser} tenantUser - The tenant user to check.
 * @param {typeof UserTenant} userTenantModel - User tenant model.
 * @param {TenancyContext} tenancyContext - Tenancy context service.
 * @returns {Promise<boolean>}
 */
export async function isTenantOwner(
  tenantUser: ModelObject<TenantUser> | null | undefined,
  userTenantModel: typeof UserTenant,
  tenancyContext: TenancyContext,
): Promise<boolean> {
  if (!tenantUser) {
    return false;
  }
  const tenant = await tenancyContext.getTenant();

  if (!tenant) {
    return false;
  }
  const membership = await userTenantModel.query().findOne({
    userId: tenantUser.systemUserId,
    tenantId: tenant.id,
    role: 'owner',
  });

  return !!membership;
}

/**
 * Throws an error in case the workspace owner is about to be mutated by
 * someone other than the owner itself.
 *
 * @param {TenantUser} targetTenantUser - The tenant user being mutated.
 * @param {TenantUser} authorizedTenantUser - The tenant user performing the action.
 * @param {typeof UserTenant} userTenantModel - User tenant model.
 * @param {TenancyContext} tenancyContext - Tenancy context service.
 * @throws {ServiceError}
 */
export async function validateTenantOwnerMutation(
  targetTenantUser: ModelObject<TenantUser>,
  authorizedTenantUser: ModelObject<TenantUser> | null | undefined,
  userTenantModel: typeof UserTenant,
  tenancyContext: TenancyContext,
): Promise<void> {
  const isTargetOwner = await isTenantOwner(
    targetTenantUser,
    userTenantModel,
    tenancyContext,
  );
  if (!isTargetOwner) {
    return;
  }
  const isAuthorizedUserOwner =
    authorizedTenantUser?.systemUserId === targetTenantUser.systemUserId;

  if (!isAuthorizedUserOwner) {
    throw new ServiceError(
      ERRORS.CANNOT_MUTATE_TENANT_OWNER,
      'The workspace owner cannot be modified by another user.',
      null,
      HttpStatus.FORBIDDEN,
    );
  }
}
