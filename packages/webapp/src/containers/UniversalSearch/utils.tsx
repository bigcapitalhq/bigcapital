import { get } from 'lodash';
import * as R from 'ramda';
import React from 'react';
import { universalSearchBinds } from './DashboardUniversalSearchBinds';
import { useAbilitiesFilter } from '@/hooks/utils';

export const getUniversalSearchBinds = (): any[] => {
  return universalSearchBinds.map((binder) => binder());
};

export const getUniversalSearchBind = (
  resourceType: string,
  key?: string,
): any => {
  const resourceConfig = getUniversalSearchBinds().find(
    (meta) => meta.resourceType === resourceType,
  );
  return key ? get(resourceConfig, key) : resourceConfig;
};

export const useGetUniversalSearchTypeOptions = (): {
  key: string;
  label: string;
}[] => {
  const abilityFilter = useAbilitiesFilter();

  const momerizedBinds = React.useMemo(() => {
    const filteredBinds = R.compose(abilityFilter, getUniversalSearchBinds)();

    return filteredBinds.map((bind) => ({
      key: bind.resourceType,
      label: bind.optionItemLabel,
    }));
  }, [abilityFilter]);

  return momerizedBinds;
};

export const getUniversalSearchItemsActions = () => {
  return getUniversalSearchBinds()
    .filter((bind) => bind.selectItemAction)
    .map((bind) => bind.selectItemAction);
};
