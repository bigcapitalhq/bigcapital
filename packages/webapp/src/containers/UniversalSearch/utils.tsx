import * as FF from 'fp-ts/function';
import { get } from 'lodash';
import React from 'react';
import { universalSearchBinds } from './DashboardUniversalSearchBinds';
import type { UniversalSearchBind } from './types';
import type { SearchTypeOption } from '@/components/UniversalSearch/UniversalSearch';
import { useAbilitiesFilter } from '@/hooks/utils';

/**
 * Retrieves the universal search binds.
 */
export const getUniversalSearchBinds = (): UniversalSearchBind[] => {
  return universalSearchBinds.map((binder) => binder());
};

/**
 * Retrieves the universal search bind by the given resource type.
 */
export function getUniversalSearchBind(
  resourceType: string,
): UniversalSearchBind | undefined;
export function getUniversalSearchBind<K extends keyof UniversalSearchBind>(
  resourceType: string,
  key: K,
): UniversalSearchBind[K] | undefined;
export function getUniversalSearchBind(
  resourceType: string,
  key?: keyof UniversalSearchBind,
) {
  const resourceConfig = getUniversalSearchBinds().find(
    (meta) => meta.resourceType === resourceType,
  );
  return key ? get(resourceConfig, key) : resourceConfig;
}

/**
 * Retrieve universal search type options.
 */
export const useGetUniversalSearchTypeOptions = (): SearchTypeOption[] => {
  const abilityFilter = useAbilitiesFilter();

  const momerizedBinds = React.useMemo(() => {
    const filteredBinds = FF.pipe(getUniversalSearchBinds(), abilityFilter);

    return filteredBinds.map((bind) => ({
      key: bind.resourceType,
      label: bind.optionItemLabel,
    }));
  }, [abilityFilter]);

  return momerizedBinds;
};

/**
 * Retrieve universal search types actions.
 */
export const getUniversalSearchItemsActions = () => {
  return getUniversalSearchBinds()
    .map((bind) => bind.selectItemAction)
    .filter(
      (
        action,
      ): action is NonNullable<UniversalSearchBind['selectItemAction']> =>
        !!action,
    );
};
