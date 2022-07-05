import React from 'react';
import moment from 'moment';
import { castArray } from 'lodash';

import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

/**
 * Retrieves the default trial balance query.
 */
export function getDefaultTrialBalanceQuery() {
  return {
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
    filterByOption: 'with-transactions',
    branchesIds: [],
  };
}

/**
 * Parses the trial balance sheet query of browser location.
 */
const parseTrialBalanceSheetQuery = (locationQuery) => {
  const defaultQuery = getDefaultTrialBalanceQuery();

  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,

    // Ensures the branches ids is always array.
    branchesIds: castArray(transformed.branchesIds),
  };
};

/**
 * Retrieves the trial balance sheet query.
 */
export const useTrialBalanceSheetQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  // Merges the default filter query with location URL query.
  const query = React.useMemo(
    () => parseTrialBalanceSheetQuery(locationQuery),
    [locationQuery],
  );

  return {
    query,
    locationQuery,
    setLocationQuery,
  };
};
