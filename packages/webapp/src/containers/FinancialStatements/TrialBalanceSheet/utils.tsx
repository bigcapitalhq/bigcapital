import { TrialBalanceTableQuery } from '@bigcapital/sdk-ts';
import { castArray } from 'lodash';
import moment from 'moment';
import React from 'react';
import { transformFilterFormToQuery } from '../common';
import { useAccountingReportQuery } from '../useAccountingReportQuery';
import type { AccountingBasis } from '@/hooks/query/settings';
import { transformToForm } from '@/utils';

type TrialBalanceQuery = TrialBalanceTableQuery & {
  filterByOption?: string;
  basis: AccountingBasis;
};

/**
 * Retrieves the default trial balance query.
 */
export function getDefaultTrialBalanceQuery(
  basis: AccountingBasis,
): TrialBalanceQuery {
  return {
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    basis,
    filterByOption: 'with-transactions',
    branchesIds: [] as number[],
    numberFormat: {},
    columnSortBy: undefined,
    sortOrder: undefined,
  };
}

/**
 * Parses the trial balance sheet query of browser location.
 */
const parseTrialBalanceSheetQuery = (
  locationQuery: Record<string, unknown>,
  basis: AccountingBasis,
): TrialBalanceQuery => {
  const defaultQuery = getDefaultTrialBalanceQuery(basis);
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
export const useTrialBalanceSheetQuery = () =>
  useAccountingReportQuery(parseTrialBalanceSheetQuery);

/**
 * Retrieves the trial balance sheet http query.
 * @returns {object}
 */
export const useTrialBalanceSheetHttpQuery = () => {
  const { query } = useTrialBalanceSheetQuery();
  return React.useMemo(() => transformFilterFormToQuery(query), [query]);
};
