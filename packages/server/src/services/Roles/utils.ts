import { ISubjectAbilitiesSchema } from '@/interfaces';
import { keyBy } from 'lodash';

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
export function getInvalidPermissions(schema: ISubjectAbilitiesSchema[], permissions) {
  const schemaMap = transformAbilitySchemaToMap(schema);

  return permissions.filter((permission) => {
    const { subject, ability } = permission;

    if (
      !schemaMap[subject] ||
      (!schemaMap[subject].abilities[ability] && !schemaMap[subject].extraAbilities[ability])
    ) {
      return true;
    }
    return false;
  });
}
