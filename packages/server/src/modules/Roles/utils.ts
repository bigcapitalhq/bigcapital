import { keyBy } from 'lodash';
import { ISubjectAbilitiesSchema } from './Roles.types';
import { CommandRolePermissionDto } from './dtos/Role.dto';
import { AbilitySchema } from './AbilitySchema';
import { ServiceError } from '../Items/ServiceError';
import { ERRORS } from './constants';
import { Role } from './models/Role.model';
import { getAbilityForRole } from './TenantAbilities';

/**
 * Detarmines whether the given role is the predefined admin role.
 */
export function isAdminRole(role: Pick<Role, 'slug'> | undefined): boolean {
  return role?.slug === 'admin';
}

/**
 * Detarmines whether the given actor role can grant the target role.
 * The admin role can grant any role, otherwise the target role permissions
 * should be a subset of the actor role permissions.
 */
export function canRoleGrantRole(
  actorRole: Pick<Role, 'slug' | 'permissions'>,
  targetRole: Pick<Role, 'slug' | 'permissions'>,
): boolean {
  if (isAdminRole(actorRole)) {
    return true;
  }
  if (isAdminRole(targetRole)) {
    return false;
  }
  const actorAbility = getAbilityForRole(actorRole);
  const targetPermissions = (targetRole.permissions || []).filter(
    (permission) => permission.value,
  );

  return targetPermissions.every((permission) =>
    actorAbility.can(permission.ability, permission.subject),
  );
}

/**
 * Transformes ability schema to map.
 */
export function transformAbilitySchemaToMap(schema: ISubjectAbilitiesSchema[]) {
  return keyBy(
    schema.map((item) => ({
      ...item,
      abilities: keyBy(item.abilities, 'key'),
      extraAbilities: keyBy(item.extraAbilities, 'key'),
    })),
    'subject',
  );
}

/**
 * Retrieve the invalid permissions from the given defined schema.
 * @param {ISubjectAbilitiesSchema[]} schema
 * @param permissions
 * @returns
 */
export function getInvalidPermissions(
  schema: ISubjectAbilitiesSchema[],
  permissions,
) {
  const schemaMap = transformAbilitySchemaToMap(schema);

  return permissions.filter((permission) => {
    const { subject, ability } = permission;

    if (
      !schemaMap[subject] ||
      (!schemaMap[subject].abilities[ability] &&
        !schemaMap[subject].extraAbilities[ability])
    ) {
      return true;
    }
    return false;
  });
}

/**
 * Validates the invalid given permissions.
 * @param {ICreateRolePermissionDTO[]} permissions -
 */
export const validateInvalidPermissions = (
  permissions: CommandRolePermissionDto[],
) => {
  const invalidPerms = getInvalidPermissions(AbilitySchema, permissions);

  if (invalidPerms.length > 0) {
    throw new ServiceError(ERRORS.INVALIDATE_PERMISSIONS, null, {
      invalidPermissions: invalidPerms,
    });
  }
};
