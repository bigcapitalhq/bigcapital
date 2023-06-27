// @ts-nocheck
import { get } from 'lodash';
import * as R from 'ramda';
import React from 'react';

import { universalSearchBinds } from './DashboardUniversalSearchBinds';
import { useAbilitiesFilter } from '@/hooks/utils';

/**
 *
 * @returns
 */
export const getUniversalSearchBinds = () => {
  return universalSearchBinds.map((binder) => binder());
};

/**
 *
 * @param {*} resourceType
 * @param {*} key
 * @returns
 */
export const getUniversalSearchBind = (resourceType, key) => {
  const resourceConfig = getUniversalSearchBinds().find(
    (meta) => meta.resourceType === resourceType,
  );
  return key ? get(resourceConfig, key) : resourceConfig;
};

/**
 * Retrieve universal search type options.
 */
export const useGetUniversalSearchTypeOptions = () => {
  const abilityFilter = useAbilitiesFilter();

  const memorizedBinds = React.useMemo(() => {
    const filteredBinds = R.compose(abilityFilter, getUniversalSearchBinds)();

    return filteredBinds.map((bind) => ({
      key: bind.resourceType,
      label: bind.optionItemLabel,
    }));
  }, [abilityFilter]);

  return memorizedBinds;
};

/**
 * Retrieve universal search types actions.
 */
export const getUniversalSearchItemsActions = () => {
  return getUniversalSearchBinds()
    .filter((bind) => bind.selectItemAction)
    .map((bind) => bind.selectItemAction);
};
