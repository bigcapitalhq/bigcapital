import { TrialBalanceTableQuery } from '@bigcapital/sdk-ts';
import { castArray } from 'lodash';
import moment from 'moment';
import React from 'react';
import { transformFilterFormToQuery } from '../common';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

/**
 * Retrieves the default trial balance query.
 */
export function getDefaultTrialBalanceQuery(): TrialBalanceTableQuery {
  return {
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    basis: 'accrual',
    // filterByOption: 'with-transactions',
    branchesIds: [] as number[],
    // numberFormat: {},
  };
}

/**
 * Parses the trial balance sheet query of browser location.
 */
const parseTrialBalanceSheetQuery = (
  locationQuery: Record<string, unknown>,
): TrialBalanceTableQuery => {
  const defaultQuery = getDefaultTrialBalanceQuery();
  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,
    // Ensures the branches ids is always array.
    branchesIds: castArray(transformed.branchesIds).map((id) => Number(id)),
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

/**
 * Retrieves the trial balance sheet http query.
 * @returns {object}
 */
export const useTrialBalanceSheetHttpQuery = () => {
  const { query } = useTrialBalanceSheetQuery();
  return React.useMemo(() => transformFilterFormToQuery(query), [query]);
};
