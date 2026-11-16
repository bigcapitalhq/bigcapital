import moment from 'moment';
import React from 'react';
import { FALLBACK_REPORT_BASIS, ReportBasis } from '../reportBasis';
import { useDefaultReportBasis } from '../withReportBasis';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

/**
 * Retrieves the default journal report query.
 */
export const getDefaultJournalQuery = (
  basis: ReportBasis = FALLBACK_REPORT_BASIS,
) => {
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
  basis: ReportBasis,
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
export const useJournalQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();
  const { basis } = useDefaultReportBasis();

  // Merges the default filter query with location URL query.
  const query = React.useMemo(
    () => parseJournalQuery(locationQuery, basis),
    [locationQuery, basis],
  );

  return {
    query,
    locationQuery,
    setLocationQuery,
  };
};
