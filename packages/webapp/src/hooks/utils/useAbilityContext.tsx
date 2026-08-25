import { useAbility } from '@casl/react';
import React from 'react';
import type { AnyAbility } from '@casl/ability';
import { AbilityContext } from '@/components';

export const useAbilityContext = () =>
  useAbility(AbilityContext as unknown as React.Context<AnyAbility>);

interface PermissibleItem {
  permission?: { ability: string; subject: string };
}

/**
 *
 */
export const useAbilitiesFilter = () => {
  const ability = useAbilityContext();

  return React.useCallback(
    <T extends PermissibleItem>(items: T[]): T[] => {
      return items.filter(
        (item) =>
          !item.permission ||
          ability.can(item.permission.ability, item.permission.subject),
      );
    },
    [ability],
  );
};
