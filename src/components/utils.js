import { castArray, isEmpty, includes, pickBy } from 'lodash';

/**
 * Filters the given accounts of the given query.
 * @param {*} accounts
 * @param {*} queryProps
 * @returns {*}
 */
export const filterAccountsByQuery = (accounts, queryProps) => {
  const defaultQuery = {
    filterByParentTypes: [],
    filterByTypes: [],
    filterByNormal: [],
    filterByRootTypes: [],
    ...pickBy(queryProps, v => v !== undefined),
  };
  const query = {
    filterByParentTypes: castArray(defaultQuery.filterByParentTypes),
    filterByTypes: castArray(defaultQuery.filterByTypes),
    filterByNormal: castArray(defaultQuery.filterByNormal),
    filterByRootTypes: castArray(defaultQuery.filterByRootTypes),
  };
  let filteredAccounts = [...accounts];

  if (!isEmpty(query.filterByParentTypes)) {
    filteredAccounts = filteredAccounts.filter((account) =>
      includes(query.filterByParentTypes, account.account_parent_type),
    );
  }
  if (!isEmpty(query.filterByTypes)) {
    filteredAccounts = filteredAccounts.filter((account) =>
      includes(query.filterByTypes, account.account_type),
    );
  }
  if (!isEmpty(query.filterByNormal)) {
    filteredAccounts = filteredAccounts.filter((account) =>
      includes(query.filterByTypes, account.account_normal),
    );
  }
  if (!isEmpty(query.filterByRootTypes)) {
    filteredAccounts = filteredAccounts.filter((account) =>
      includes(query.filterByRootTypes, account.account_root_type),
    );
  }
  return filteredAccounts;
};
