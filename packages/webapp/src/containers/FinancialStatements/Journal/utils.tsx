import moment from 'moment';
import { useAccountingReportQuery } from '../useAccountingReportQuery';
import type { AccountingBasis } from '@/hooks/query/settings';
import { transformToForm } from '@/utils';

/**
 * Retrieves the default journal report query.
 */
export const getDefaultJournalQuery = (basis: AccountingBasis) => {
  return {
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    basis,
    numberFormat: {},
  };
};

/**
 * Parses balance sheet query.
 */
const parseJournalQuery = (
  locationQuery: Record<string, unknown>,
  basis: AccountingBasis,
) => {
  const defaultQuery = getDefaultJournalQuery(basis);

  return {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
};

/**
 * Retrieves the journal sheet query.
 */
export const useJournalQuery = () =>
  useAccountingReportQuery(parseJournalQuery);
