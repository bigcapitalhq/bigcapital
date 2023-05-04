import { useMemo } from 'react';
import { filterAccountsByQuery, nestedArrayToflatten } from '@/utils';

interface PreprocessingAccountsOptions {
  filterByRootTypes: string[];
  filterByParentTypes: string[];
  filterByTypes: string[];
  filterByNormal: string[];
}

export const usePreprocessingAccounts = (
  items: any,
  {
    filterByRootTypes,
    filterByParentTypes,
    filterByTypes,
    filterByNormal,
  }: PreprocessingAccountsOptions,
) => {
  return useMemo(() => {
    const flattenAccounts = nestedArrayToflatten(items);
    const filteredAccounts = filterAccountsByQuery(flattenAccounts, {
      filterByRootTypes,
      filterByParentTypes,
      filterByTypes,
      filterByNormal,
    });
    return filteredAccounts;
  }, [
    items,
    filterByRootTypes,
    filterByParentTypes,
    filterByTypes,
    filterByNormal,
  ]);
};
