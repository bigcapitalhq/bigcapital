import { castArray } from 'lodash';
import moment from 'moment';
import React from 'react';
import { FALLBACK_REPORT_BASIS, ReportBasis } from '../reportBasis';
import { useDefaultReportBasis } from '../withReportBasis';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

export const getDefaultCashFlowSheetQuery = (
  basis: ReportBasis = FALLBACK_REPORT_BASIS,
) => {
  return {
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    basis,
    displayColumnsType: 'total',
    filterByOption: 'with-transactions',
    branchesIds: [],
    numberFormat: {},
  };
};

const parseCashflowQuery = (
  query: Record<string, unknown>,
  basis: ReportBasis,
) => {
  const defaultQuery = getDefaultCashFlowSheetQuery(basis);

  const transformed = {
    ...defaultQuery,
    ...transformToForm(query, defaultQuery),
  };
  return {
    ...transformed,

    // Ensures the branches ids is always array.
    branchesIds: castArray(transformed.branchesIds),
  };
};

/**
 * Retrieves the cashflow statement query.
 */
export const useCashflowStatementQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();
  const { basis } = useDefaultReportBasis();

  // Merges the default filter query with location URL query.
  const query = React.useMemo(
    () => parseCashflowQuery(locationQuery, basis),
    [locationQuery, basis],
  );

  return {
    query,
    locationQuery,
    setLocationQuery,
  };
};
