import { castArray } from 'lodash';
import moment from 'moment';
import { useAccountingReportQuery } from '../useAccountingReportQuery';
import type { AccountingBasis } from '@/hooks/query/settings';
import { transformToForm } from '@/utils';

export const getDefaultCashFlowSheetQuery = (basis: AccountingBasis) => {
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
  basis: AccountingBasis,
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
export const useCashflowStatementQuery = () =>
  useAccountingReportQuery(parseCashflowQuery);
