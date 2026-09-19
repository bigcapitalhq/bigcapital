import moment from 'moment';
import React from 'react';
import { withRememberedPeriod } from '../reportingPeriod';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

/**
 * Retrieves the default journal report query.
 */
export const getDefaultJournalQuery = () => {
  return {
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    basis: 'accrual',
  };
};

/**
 * Parses balance sheet query.
 */
const parseJournalQuery = (locationQuery: Record<string, unknown>) => {
  const defaultQuery = getDefaultJournalQuery();

  return {
    ...withRememberedPeriod(defaultQuery),
    ...transformToForm(locationQuery, defaultQuery),
  };
};

/**
 * Retrieves the journal sheet query.
 */
export const useJournalQuery = () => {
  // Retrieves location query.
  const [locationQuery, setLocationQuery] = useAppQueryString();

  // Merges the default filter query with location URL query.
  const query = React.useMemo(
    () => parseJournalQuery(locationQuery),
    [locationQuery],
  );

  return {
    query,
    locationQuery,
    setLocationQuery,
  };
};
