// @ts-nocheck
import React from 'react';
import { castArray } from 'lodash';
import moment from 'moment';

import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

/**
 * Retrieves the default journal report query.
 */
export const getDefaultJournalQuery = () => {
  return {
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accrual',
  };
};


/**
 * Parses balance sheet query.
 */
 const parseJournalQuery = (locationQuery) => {
  const defaultQuery = getDefaultJournalQuery();

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
